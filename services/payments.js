'use strict'

const invoiceService = require('./invoices')
const organizationService = require('./organizations')
const gatewayService = require('./gateways')
const offline = require('@open-age/offline-processor')

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

    // if (paymentDetails.mode === 'cash') {
    //     let invoiceModel = invoicePaymentCalculator(invoice, payment)
    //     await invoiceService.update(invoiceModel, invoice.id, context)
    //     return payment
    // }

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

    let organization = await organizationService.get(model.organization, context)

    if (model.gateway) {
        gateway = await gatewayService.getById(model.gateway.id, context)
    }

    let user = context.user

    let payment = await new db.payment({
        date: model.date || new Date(),
        amount: model.amount,
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

    // context.processSync = true
    // offline.queue('payment', 'started', { id: payment.id }, context)

    log.end()
    return payment
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
                //todo
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

const getById = async (id, context) => {
    context.logger.start('services/payments:getById')

    return db.payment.findById(id).populate('user invoice organization').populate({
        path: 'gateway',
        populate: {
            path: 'provider'
        }
    })
}

module.exports = {
    create: create,
    update: update,
    getById: getById
}