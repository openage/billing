'use strict'

const taxService = require('../services/taxes')
const mapper = require('../mappers/tax')

exports.create = async (req) => {
    let log = req.context.logger.start('api/taxes:create')

    let tax = await taxService.create(req.body, req.context)
    log.end()
    return mapper.toModel(tax)
}

exports.update = async (req) => {
    let log = req.context.logger.start('api/taxes:update')

    let tax = await taxService.update(req.body, req.params.id, req.context)

    log.end()
    return mapper.toModel(tax)
}

exports.search = async (req) => {
    let log = req.context.logger.start('api/taxes:search')

    let query = {
        tenant: req.context.tenant.id
    }

    let taxes = await db.tax.find(query)

    return mapper.toSearchModel(taxes)
}