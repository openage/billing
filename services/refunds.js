'use strict'

const paymentService = require('./payments')
const gatewayService = require('./gateways')
const invoiceService = require('./invoices')

const create = async (model, context) => {
    let log = context.logger.start('services/refunds:create')

    let payment = await paymentService.getById(model.payment.id, context)

    let gateway = await gatewayService.getById(model.gateway.id, context)

    let invoice = await invoiceService.getById(model.invoice.id, context)

    let refund = new db.refund({
        date: model.date || new Date(),
        amount: model.amount,
        mode: model.mode,
        file: model.file,
        invoice: invoice,
        payment: payment,
        gateway: gateway,
        user: context.user,
        organization: context.organization,
        tenant: context.tenant
    })

    let gatewayProvider = require(`../providers/${gateway.provider.code}`)
    let data = await gatewayProvider.refund(refund, gateway.config)
    refund.details = data
    await refund.save()
    log.end()
    return refund
}


exports.create = create