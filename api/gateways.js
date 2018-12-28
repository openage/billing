'use strict'

const gatewayService = require('../services/gateways')
const organizationService = require('../services/organizations')
const mapper = require('../mappers/gateway')

exports.create = async (req) => {
    let log = req.context.logger.start('api/gateways:create')

    let gateway = await gatewayService.create(req.body, req.context)
    log.end()
    return mapper.toModel(gateway)

}

exports.get = async (req) => {
    let log = req.context.logger.start('api/gateways:get')

    let gateway = await gatewayService.getById(req.params.id, req.context)
    log.end()
    return mapper.toModel(gateway)

}

exports.search = async (req) => {
    let log = req.context.logger.start('api/gateways:search')

    let where = req.query
    let query = {
        tenant: req.context.tenant.id
    }

    if (where.organizationId) {
        query.organization = await organizationService.get(where.organizationId, req.context)
    }

    let gatewayList = await db.gateway.find(query).populate('provider organization tenant')

    log.end()
    return mapper.toSearchModel(gatewayList)
}