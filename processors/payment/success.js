'use strict'

const sendIt = require('../../providers/send-it')
const paymentService = require('../../services/payments')

exports.process = async (data, context) => {
    let log = context.logger.start('sending notification on payment success ...')
    if (!data || !data.id) {
        return
    }

    let payment = await paymentService.getById(data.id, context)

    // await sendIt.send({ id: payment.id, amount: payment.amount, organization: payment.organization.name }, 'notify-buyer-on-payment-success',
    //     [{ roleKey: payment.user.role.key }], payment.user.role.key, ['push']).then((response) => {
    //     log.info('push delivered')
    // })
}
