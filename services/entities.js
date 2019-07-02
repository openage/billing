'use strict'

const entityTypeService = require('./settings')

const create = async (model, context) => {
    let log = context.logger.start('services/entities/create')

    let type = await entityTypeService.getOrCreate(model.type, context)

    if (!type) {
        throw new Error('entity-type not found')
    }

    model.type = type.id

    if (!model.organization) {
        model.organization = context.organization.id
    }

    if (!model.tenant) {
        model.tenant = context.tenant.id
    }

    log.end()
    let entity = await new db.entity(model).save()

    return db.entity.findById(entity.id).populate('type')
}

const get = async (query, context) => {
    context.logger.start('services/entities:get')
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.entity.findById(query).populate('type')
        }
    }

    if (query.entityId) {
        return db.entity.findOne({ entityId: query.entityId }).populate('type')
    }

    if (query.id) {
        return db.entity.findById(query.id).populate('type')
    }

    return null
}

const getOrCreate = async (data, context) => {
    let log = context.logger.start("services/entities:getOrCreate")

    let entity = await get(data, context)

    if (!entity) {
        entity = await create(data, context)
    }

    log.end()
    return entity
}

exports.create = create
exports.get = get
exports.getOrCreate = getOrCreate