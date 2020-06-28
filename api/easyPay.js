'use strict'
const invoiceService = require('../services/invoice')
const mapper = require('../mappers/easyPay')

exports.create = async (req) => {
    let log = req.context.logger.start('api/easyPay:create')

    let data = {
        rollNo: req.params.id
    }

    let invoice = await invoiceService.create(data, req.context)
    invoice = await invoiceService.getById(invoice.id, req.context)
    log.end()
    return mapper.toModel(invoice, req.context)
}

exports.update = async (req) => {
    let log = req.context.logger.start('api/easyPay:update')

    let data = {
        status: 'paid',
        lineItems: []
    }

    req.body.lineItems.forEach(item => {
        data.lineItems.push({
            amount: item.amount,
            entity: {
                id: item.code
            }
        })
    })

    let invoice = await invoiceService.update(data, req.body.code, req.context)
    log.end()
    return 'Paid'
}
