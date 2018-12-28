'use strict'

const settingService = require('../services/settings')
const mapper = require('../mappers/entity-type')

exports.create = async (req) => {
    let log = req.context.logger.start('api/settings:create')

    // create entity-type for agent and its organization having same configuration

    // organization entity-type have not owner and qualifier
    // entity-type of agent have qualifier

    // appointment is entity having entity-type
    //f7d6d489-24c5-03cd-c5bd-434347ed3578

    // if (req.params.entityType) {
    //     model.code = `${req.params.entityType}:${req.params.entityTypeId}`
    // }

    let query = {
        code: req.body.code
    }

    if (req.body.qualifier) {
        query.qualifier = req.body.qualifier
    }

    let entityType = await db.entityType.findOne(query)

    if (entityType) {
        throw new Error(`code this ${req.body.code} already exist`)
    }

    let model = {
        code: req.body.code,
        name: req.body.name,
        pic: req.body.pic,
        billing: req.body.billing,
        rate: req.body.rate,
        qualifier: req.body.qualifier,
        service: req.body.service,
        organization: req.body.organization,
        tenant: req.context.tenant.id
    }

    let dbObject = await settingService.create(model, req.context)

    log.end()
    return mapper.toModel(dbObject)
}

exports.get = async (req) => {
    let log = req.context.logger.start('api/settings:get')

    let dbObject = await settingService.getById(req.params.id, req.context)

    log.end()
    return mapper.toModel(dbObject)
}
