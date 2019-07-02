'use strict'

const gatewayProviderService = require('./gateway-providers')
const db = require('../models')


const create = async (data, context) => {
    let log = context.logger.start('services/gateways:create')

    let model = {
        config: data.config
    }

    model.provider = (await gatewayProviderService.getOrCreate(data.provider, context)).id

    if (data.organization) {
        model.organization = (await organizationService.get(data.organization, context)).id
    } else if (context.organization) {
        model.organization = context.organization.id
    }

    if (!data.tenant) {
        model.tenant = (context.tenant).id
    }

    let gateway = await new db.gateway(model).save()

    log.end()
    return gateway
}

const getById = (id, context) => {
    context.logger.start('services/gateways:getById')

    return db.gateway.findById(id).populate('provider')
}

const getByCode = (code, context) => {
    context.logger.start('services/gateways:getByCode')

    return db.gateway.findByCode({ code: code })
}

const getOrgOrTenantGateways = async (query, context) => {
    context.logger.start('services/gateways:getOrgOrTenantGateways')
    let gatewayList
    if (query.organization) {
        gatewayList = await db.gateway.find({ organization: query.organization }).populate('provider')
    }

    if (gatewayList.length) {
        return gatewayList
    }

    return db.gateway.find({
        tenant: query.tenant || context.tenant
    }).populate('provider')
}

module.exports = {
    create: create,
    getById: getById,
    getByCode: getByCode,
    getOrgOrTenantGateways: getOrgOrTenantGateways
}