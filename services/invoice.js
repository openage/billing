'use strict'

const db = require('../models')
const entityService = require('./entities')
const userService = require('./users')
const organizationService = require('./organizations')
const offline = require('@open-age/offline-processor')
const { default: tenant } = require('../models/tenant')

const create = async (data, context) => {
    let log = context.logger.start('services/invoices:create')

    if (context.organization && context.organization.sources && context.organization.sources.invoice) {
        var source = require(`../providers/${context.organization.sources.invoice.code}`)
        data = await source.getInvoice(data, context)
    }

    let buyer = await userService.get(data.buyer, context)

    if (!buyer) {
        buyer = await userService.create(data.buyer, context)
    }

    let seller = context.user

    if (data.seller) {
        seller = await userService.get(data.seller, context)

        if (!seller) {
            seller = await userService.create(data.seller, context)
        }
    }

    let model = {
        order: data.order,
        entityId: data.entityId,
        date: data.date || new Date(),
        dueDate: data.dueDate,
        status: data.status || 'due',
        lineItems: [],
        tags: data.tags,
        buyer: buyer.id,
        seller: seller.id,
        service: data.service,
        tenant: context.tenant,
        hooks: data.hooks
    }

    let organization = await organizationService.get(data.organization || context.organization, context)

    if (organization) {
        model.organization = organization
        model.code = ++organization.lastInvoiceNo
        organization.lastInvoiceNo = model.code
        await organization.save()
    } else {
        model.code = ++context.tenant.lastInvoiceNo
        context.tenant.lastInvoiceNo = model.code
        await context.tenant.save()
    }

    // model.taxes = []    //todo
    // model.discount = data.discount  //todo
    let netAmount = 0
    for (let index = 0; index < data.lineItems.length; index++) { // todo to calculate taxes and discount
        let item = data.lineItems[index]
        let rates = []
        let parts = []
        let consumption
        let netItemAmount = 0

        let entity = await entityService.getOrCreate(item.entity, context)
        if (!entity) {
            throw new Error(`no such entity found ${item.entity}`)
        }

        if (item.consumption) {
            consumption = item.consumption
        } else if (entity.consumption) {
            consumption = {
                quantity: entity.consumption.quantity,
                from: entity.consumption.from,
                till: entity.consumption.till
            }
        }

        if (item.parts && item.parts.length) {
            parts = item.parts
            for (let part of parts) {
                netItemAmount = netItemAmount + part.amount * (consumption.quantity || 1)
            }
        } else if (entity.rate && entity.rate.length) {
            rates = entity.rate || entity.type.rate
            for (let rate of rates) {
                let part = {
                    code: rate.code,
                    description: rate.description,
                    amount: rate.value
                }
                netItemAmount = netItemAmount + part.amount * (consumption.quantity || 1)
                parts.push(part)
            }
        }

        netAmount = netAmount + netItemAmount
        model.lineItems.push({
            code: item.id,
            amount: netItemAmount,
            entity: entity.id,
            parts: parts,
            consumption: consumption,
            description: item.description,
            details: item.details
        })
    }

    model.amount = netAmount

    if (model.status === 'due') {
        model.dueAmount = model.amount
    }

    let invoice = await new db.invoice(model).save()

    log.end()
    return invoice
}

const getById = async (id, context) => {
    context.logger.start('services/invoices:getById')

    if (id.isObjectId()) {
        return db.invoice.findById(id).populate('seller buyer organization lineItems.entity tenant').populate({
            path: 'lineItems.entity',
            populate: {
                path: 'type'
            }
        })
    } else {
        return db.invoice.findOne({ entityId: id }).populate('seller buyer organization lineItems.entity tenant').populate({
            path: 'lineItems.entity',
            populate: {
                path: 'type'
            }
        })
    }
}

const update = async (data, id, context) => {
    let log = context.logger.start('services/invoices:update')

    let invoice = await db.invoice.findById(id)

    if (data.order) {
        invoice.order = data.order
    }

    if (data.dueDate) {
        invoice.dueDate = data.dueDate
    }

    if (data.status) {
        invoice.status = data.status
    }

    if (data.lineItems && data.lineItems.length) {
        invoice.lineItems = []
        for (let index = 0; index < data.lineItems.length; index++) { // todo to calculate taxes and discount
            let item = data.lineItems[index]

            let entity = await entityService.get(item.entity, context)

            if (!entity) {
                throw new Error(`no such entity found ${item.entity}`)
            }

            invoice.lineItems.push({
                amount: item.amount,
                entity: entity.id
            })
        }
    }

    function isRefundable(data, invoice) {
        return !!(data.status === 'cancelled' && invoice.status === 'paid')
    }

    if (isRefundable(data, invoice)) {
        let payment = await db.payment.findOne({ invoice: invoice.id })
        context.processSync = true
        offline.queue('payment', 'refund', { id: payment.id }, context)
    }

    await invoice.save()
    invoice = await getById(invoice.id, context)

    await offline.queue('invoice', invoice.status, invoice, context)
    // if (context.organization.code == 'gku') {
    //     edu.updateInvoice(invoice, context)
    // }

    log.end()
    return invoice
}

const getInLimit = async (number, query, context) => {
    return db.invoice.find(query).limit(number)
}

const getCount = async (query, context) => {
    return db.invoice.find(query).count()
}

exports.create = create
exports.getById = getById
exports.update = update
exports.getInLimit = getInLimit
exports.getCount = getCount
