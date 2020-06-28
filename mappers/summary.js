'use strict'

const invoiceMapper = require('./invoice')

exports.toModel = (entity, context) => {
    let model = {
        dueCount: entity.dueCount,
        dueAmount: entity.dueAmount,
        payments: []
    }

    if (entity.payments && entity.payments.length) {
        model.payments = entity.payments.map((payment) => {
            return {
                date: payment.date,
                cashAmount: payment.cashAmount,
                cardAmount: payment.cardAmount,
                onlineAmount: payment.onlineAmount
            }
        })
    }

    return model
}
