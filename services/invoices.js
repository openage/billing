'use strict'

const entityService = require('./entities')
const userService = require('./users')
const organizationService = require('./organizations')
const offline = require('@open-age/offline-processor')

const create = async (data, context) => {
    let log = context.logger.start('services/invoices:create')

    let buyer = await userService.getOrCreate(data.buyer, context)

    let model = {
        order: data.order,
        date: data.date || new Date(),
        dueDate: data.dueDate,
        status: data.status || 'due',
        lineItems: [],
        tags: data.tags,
        buyer: buyer.id,
        seller: context.user.id,
        service: data.service,
        tenant: context.tenant
    }

    let organization = await organizationService.get(data.organization || context.organization, context)

    if (!organization) {
        throw new Error('organization not found')
    } else {
        model.organization = organization
        model.code = ++organization.lastInvoiceNo
        organization.lastInvoiceNo = model.code
        await organization.save()
    }

    // model.taxes = []    //todo 
    // model.discount = data.discount  //todo
    let netAmount = 0
    for (let index = 0; index < data.lineItems.length; index++) {  //todo to calculate taxes and discount 
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
                till: entity.consumption.till,
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

    return db.invoice.findById(id).populate('seller buyer organization lineItems.entity tenant')
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
        for (let index; index < data.lineItems.length; index++) {  //todo to calculate taxes and discount 
            let item = model.lineItems[index]

            let entity = await entityService.get(item.entity, context)

            if (!entity) {
                throw new Error(`no such entity found ${item.entity}`)
            }

            invoice.lineItems.push({
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

    log.end()
    return getById(invoice.id, context)
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