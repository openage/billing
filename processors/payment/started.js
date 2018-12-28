'use strict'

const sendIt = require('../../providers/send-it')
const paymentService = require('../../services/payments')

exports.process = async (data, context) => {
    let log = context.logger.start('sending notification on payment started ...')
    if (!data || !data.id) {
        return
    }

    let payment = await paymentService.getById(data.id, context)

    return sendIt.send({ id: payment.id }, 'notify-buyer-on-payment-started',
        [{ roleKey: payment.user.role.key }], payment.user.role.key, ['push']).then((response) => {
            log.info('push delivered')
        })
}