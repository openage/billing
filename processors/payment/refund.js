'use strict'

const paymentService = require('../../services/payments')
const refundService = require('../../services/refunds')

exports.process = async (data, context) => {
    context.logger.start('processors/payment/refund')

    if (!data || !data.id) {
        return
    }

    let payment = await paymentService.getById(data.id, context)

    return refundService.create({
        amount: payment.amount,
        mode: payment.mode,
        invoice: payment.invoice,
        gateway: payment.gateway,
        payment: payment
    }, context)
}