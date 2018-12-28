'use strict'
const db = require('../models')
const userService = require('./users')

const set = (model, entity, context) => {
    if (model.code) {
        entity.code = model.code
    }

    if (model.name) {
        entity.name = model.name
    }

    if (model.shortName) {
        entity.shortName = model.shortName
    }

    if (model.address) {
        entity.address = model.address
    }

    if (model.status) {
        entity.status = model.status
    }
}

const create = async (model, context) => {
    context.logger.info(`creating organization ${model.code}`)

    if (!model.tenant) {
        model.tenant = context.tenant
    }

    let organization = await new db.organization({
        code: model.code,
        tenant: model.tenant
    }).save()

    set(model, organization, context)

    return organization.save()
}

const update = async (id, model, context) => {
    let organization = await db.organization.findById(id)

    for (let key in model) {
        organization[key] = model[key]
    }

    return organization.save()
}

const get = async (query, context) => {
    let where = {
        tenant: context.tenant
    }
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.organization.findById(query)
        }
        where.code = query
        return db.organization.findOne(where)
    }
    if (query.id) {
        return db.organization.findById(query.id)
    }
    if (query.code) {
        where.code = query.code
        return db.organization.findOne(where)
    }
    return null
}

const getOrCreate = async (data, context) => {
    let log = context.logger.start('services/organizations:getOrCreate')

    let organization = await get(data, context)

    if (!organization) {
        organization = await create(data, context)
    }

    log.end()
    return organization
}

const getByCode = async (code, context) => {
    return db.organization.findOne({ code: code })
}

const sync = async (data, context) => {    // organization sync from directory
    let log = context.logger.start('services/organizations:sync')

    let code = data.previousCode || data.code

    let organization = await db.organization.findOne({ code: code })

    if (!organization) {
        organization = await create({ code: data.code }, context)
    }

    organization.name = data.name
    organization.code = data.code
    organization.shortName = data.shortName
    organization.type = data.type
    organization.status = data.status
    organization.address = data.address

    if (data.owner && data.owner._id) {
        organization.owner = await userService.getOrCreate({ role: { id: data.owner._id } }, context)
    }

    log.end()
    return organization.save()
}

exports.get = get
exports.getByCode = getByCode
exports.update = update
exports.create = create
exports.sync = sync
exports.getOrCreate = getOrCreate
