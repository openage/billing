'use strict'

const db = require('../models')
const organizationService = require('./organizations')

const getTypeForOrganization = async (model, context) => {
    let log = context.logger.start('services/entity-types:getTypeForOrganization')

    let type = await db.entityType.findOne({
        code: model.code,
        qualifier: {
            $exists: false
        }
    })

    if (!type) {
        type = await new db.entityType({
            code: model.code,
            name: model.name,
            pic: model.pic,
            category: model.category,
            billing: model.billing,
            rate: model.rate,
            service: model.service,
            organization: model.organization,
            tenant: model.tenant || context.tenant.id
        }).save()
    }

    log.end()
    return type
}

const create = async (model, context) => {
    const log = context.logger.start('services/entity-types:create')

    let organization
    if (model.organization) {
        organization = await organizationService.get(model.organization, context)
    } else {
        organization = context.organization
    }

    model.organization = organization

    if (!model.tenant) {
        model.tenant = context.tenant
    }

    await getTypeForOrganization(model, context)

    let entityType = new db.entityType(model).save()

    log.end()
    return entityType
}

const getById = async (id, context) => {
    context.logger.start('services/settings:getById')

    return db.entityType.findById(id)
}

const get = async (query, context) => {
    context.logger.start('services/settings:get')

    if (!query) {
        return null
    }

    if (typeof query === "string") {
        if (query.isObjectId()) {
            return db.entityType.findById(query)
        }
    }

    if (query.id) {
        return db.entityType.findById(query.id)
    }

    if (query.code && query.qualifier) {
        let where = context.where()

        where.add('code', query.code)

        if (query.qualifier.key) {
            where.add('qualifier.key', query.qualifier.key)
        }
        if (query.qualifier.value) {
            where.add('qualifier.value', query.qualifier.value)
        }
        if (query.qualifier.condition) {
            where.add('qualifier.condition', query.qualifier.condition)
        }
        return db.entityType.findOne(where.clause)
    }

    if (query.code) {
        let where = context.where().add('code', query.code)
        return db.entityType.findOne(where.clause)
    }

    return null
}

const getOrCreate = async (query, context) => {
    let log = context.logger.start('services/settings:getOrCreate')

    let entity = await get(query, context)

    if (!entity) {
        entity = await create(query, context)
    }

    return entity
}

exports.getById = getById
exports.create = create
exports.get = get
exports.getOrCreate = getOrCreate