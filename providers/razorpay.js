'use strict'

const Razorpay = require('razorpay')
const logger = require('@open-age/logger')('razorpay')

exports.success = (payment, config) => {
    let log = logger.start('capture payment start ...')

    let rzp = new Razorpay({
        key_id: config.key,
        key_secret: config.secret
    })

    let razorpayPaymentId = payment.code

    let captureAmount = 100

    return new Promise((resolve, reject) => {
        return rzp.payments.capture(razorpayPaymentId, captureAmount, (error, data) => {
            if (error) {
                return reject(error)
            }
            log.end()
            return resolve(data)
        })
    })
}

