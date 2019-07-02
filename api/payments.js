'use strict'

const mapper = require('../mappers/payment')
const paymentService = require('../services/payments')

exports.create = async (req) => {
    let log = req.context.logger.start('api/payments:create')

    let payment = await paymentService.create(req.body, req.context)
    log.end()
    return mapper.toModel(payment)
}

exports.update = async (req) => {
    let log = req.context.logger.start('api/payments:update')

    let payment = await paymentService.update(req.body, req.params.id, req.context)
    log.end()
    return mapper.toModel(payment)
}

exports.get = async (req) => {
    let log = req.context.logger.start('api/payments:get')

    let payment = await paymentService.getById(req.params.id, req.context)
    log.end()
    return mapper.toModel(payment)
}
