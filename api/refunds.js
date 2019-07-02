'use strict'

const refundService = require('../services/refunds')
const mapper = require('../mappers/refund')

exports.create = async (req) => {
    let log = req.context.logger.start('api/refunds:create')

    return refundService.create(req.body, req.context).then((refund) => {
        log.end()
        return mapper.toModel(refund)
    })
}