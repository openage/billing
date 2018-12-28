'use strict'

const entityService = require('../services/entities')
const mapper = require('../mappers/entity')

exports.create = async (req) => {
    let log = req.context.logger.start('api/entities:create')

    let entity = await entityService.create(req.body, req.context)
    log.end()
    return mapper.toModel(entity)

}

exports.get = async (req) => {
    let log = req.context.logger.start('api/entities:get')

    let entity = await entityService.getById(req.params.id, req.context)
    log.end()
    return mapper.toModel(entity)
}

