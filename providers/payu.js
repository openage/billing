'use strict'

const logger = require('@open-age/logger')('payu')

exports.start = (payment, config, context) => {
    let log = logger.start('payment started')

    return {
        payConfig: config,
        returnUrls: {
            onSuccess: `${config.returnUrls.onSuccess}/${payment.id}/capture?role-key=${context.user.role.key}`,
            onCancel: `${config.returnUrls.onCancel}/${payment.id}/capture?reason=canceled&role-key=${context.user.role.key}`,
            onFailure: `${config.returnUrls.onFailure}/${payment.id}/capture?reason=failed&role-key=${context.user.role.key}`
        },
        code: payment.id,
        amount: payment.amount,
        firstName: payment.invoice.buyer.profile.firstName,
        email: payment.invoice.buyer.email,
        phone: payment.invoice.buyer.phone,
        udf1: payment.invoice.id,
        productInfo: 'test'
    }
}
