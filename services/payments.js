'use strict'

const invoiceService = require('./invoice')
const organizationService = require('./organizations')
const gatewayService = require('./gateways')
const offline = require('@open-age/offline-processor')
const db = require('../models')
const crypto = require('../helpers/crypto')
const { mode } = require('../models/payment')

const onPaymentSuccess = async (payment, context) => {
    let log = context.logger.start('onPaymentSuccess')
    let paymentDetails = await db.payment.findById(payment.id).populate('invoice').populate({
        path: 'gateway',
        populate: {
            path: 'provider'
        }
    })

    let gateway = paymentDetails.gateway
    let invoice = paymentDetails.invoice

    function invoicePaymentCalculator(invoice, payment) {
        let obj = {}
        if (paymentDetails.amount < invoice.dueAmount) {
            obj.status = 'due'
            obj.dueAmount = invoice.dueAmount - paymentDetails.amount
        } else {
            obj.status = 'paid'
            obj.dueAmount = 0
        }
        return obj
    }

    let gatewayProvider = require(`../providers/${gateway.provider.code}`)

    let data = await gatewayProvider.success(payment, gateway.config)

    let invoiceModel = invoicePaymentCalculator(invoice, payment)
    await invoiceService.update(invoiceModel, invoice.id, context)

    payment.details = data
    log.end()
    return payment
}

const set = (model, entity, context) => {
    if (model.status) {
        entity.status = model.status
    }

    if (model.code) {
        entity.code = model.code
    }
}

const create = async (model, context) => {
    let log = context.logger.start('services/payments:create')
    let gateway
    let invoice = await invoiceService.getById(model.invoice.id, context)

    let organization = model.organization ? await organizationService.get(model.organization, context) : context.organization

    if (model.gateway) {
        gateway = await gatewayService.getById(model.gateway.id, context)
    }

    let user = context.user

    let payment = await new db.payment({
        date: model.date || new Date(),
        amount: model.amount,
        webUrl: model.webUrl,
        code: model.code,
        mode: model.mode,
        status: 'started',
        details: model.details,
        type: model.type,
        invoice: invoice,
        gateway: gateway,
        user: user,
        organization: organization,
        tenant: context.tenant
    }).save()

    if (payment.mode === 'cash') {
        await onPaymentSuccess(payment, context)
    }

    // context.processSync = true
    await offline.queue('payment', 'started', { id: payment.id }, context)

    log.end()
    return getById(payment.id, context)
}

const update = async (model, id, context) => {
    let log = context.logger.start('services/payments:update')
    context.processSync = true

    let payment = await db.payment.findById(id)

    set(model, payment, context)

    if (model.status) {
        switch (model.status) {
            // case 'started':
            //     offline.queue('payment', 'started', { id: payment.id }, context)
            //     break
            case 'failed':
                offline.queue('payment', 'failed', { id: payment.id }, context)
                break
            case 'refunded':
                // todo
                break
            case 'success':
                await onPaymentSuccess(payment, context)
                offline.queue('payment', 'success', { id: payment.id }, context)
                break
        }
    }

    log.end()
    return payment.save()
}

const start = async (id, context) => {
    let log = context.logger.start('services/payments:start')

    let payment = await getById(id, context)

    let gatewayProvider = require(`../providers/${payment.gateway.provider.code}`)

    let data = await gatewayProvider.start(payment, payment.gateway.config, context)

    let hashString = payment.gateway.config.hashSequence.send.inject(data)

    log.info(`hash string : ${hashString}`)

    data.hash = crypto.hashingLogic(hashString)

    log.end()

    return { data: data, view: payment.gateway.provider.code }
}

const capture = async (id, model, context) => {
    let log = context.logger.start('services/payments:start')

    if (model.status == 'success') {
        let payment = await getById(id, context)

        payment.details = model
        payment.status = 'success'

        await payment.save()

        if (payment.invoice.amount == payment.amount) {
            payment.invoice.status = 'paid'
            payment.invoice.save()

            context.processSync = true
            await offline.queue('invoice', 'paid', { id: payment.invoice.id }, context)
        }

        context.processSync = true
        await offline.queue('payment', 'success', { id: payment.id }, context)

        return payment.webUrl || context.tenant.config.webUrl.inject(payment)
    }
}

const getById = async (id, context) => {
    context.logger.start('services/payments:getById')

    return db.payment.findById(id).populate('user  organization').populate({
        path: 'gateway',
        populate: {
            path: 'provider'
        }
    }).populate({
        path: 'invoice',
        populate: {
            path: 'buyer seller organization lineItems.entity'
        }
    })
}

module.exports = {
    create: create,
    update: update,
    getById: getById,
    start: start,
    capture: capture
}
