'use strict'

const db = require('../models')

const create = async (model, context) => {
    let log = context.logger.start('services/gateway-providers:create')

    let gatewayProvider = await new db.gatewayProvider(model).save()

    log.end()

    return gatewayProvider
}


const get = async (query, context) => {
    context.logger.start('services/gateway-providers:get')

    if (typeof query === 'string') {
        if (query.toObjectId()) {
            return db.gatewayProvider.findById(query)
        } else {
            return db.gatewayProvider.findOne({ code: query })
        }
    }

    if (query.id) {
        return db.gatewayProvider.findById(query.id)
    }

    if (query.code) {
        return db.gatewayProvider.findOne({ code: query.code })
    }

    return null
}

const getOrCreate = async (data, context) => {
    let log = context.logger.start('services/gateway-providers:getOrCreate')

    let gatewayProvider = await get(data, context)

    if (!gatewayProvider) {
        gatewayProvider = await create(data, context)
    }

    return gatewayProvider
}

module.exports = {
    create: create,
    get: get,
    getOrCreate: getOrCreate
}