const db = require('../models')

const populate = ''

const set = async (model, entity, context) => {
    if (model.status) {
        entity.status = model.status
    }
}
exports.create = async (model, context) => {
    let entity = null

    entity = await exports.get(model, context)

    if (!entity) {
        entity = new db.entity({
            status: 'new',
            organization: context.organization,
            tenant: context.tenant
        })
    }

    await set(model, entity, context)
    return entity.save()
}

exports.update = async (id, model, context) => {
    let entity = await exports.get(id, context)
    await set(model, entity, context)
    return entity.save()
}

exports.get = async (query, context) => {
    if (!query) {
        return
    }

    if (query._bsontype === 'ObjectID') {
        query = {
            id: query.toString()
        }
    }

    if (typeof query === 'string') {
        if (query === 'my') {
            return context.user
        } else if (query.isObjectId()) {
            return db.user.findById(query).populate(populate)
        } else {
            return db.entity.findOne({
                code: query.toLowerCase(),
                organization: context.organization,
                tenant: context.tenant
            })
        }
    }

    if (query._doc) {
        return query
    }

    if (query.id) {
        if (query.id === 'my') {
            return context.user
        }
        return db.user.findById(query.id).populate(populate)
    }

    if (query.code) {
        if (query.code === 'my') {
            return context.user
        }
        return db.entity.findOne({
            code: query.toLowerCase(),
            organization: context.organization,
            tenant: context.tenant
        })
    }

    return null
}

exports.search = async (query, page, context) => {
    let where = {
        organization: context.organization,
        tenant: context.tenant
    }

    const count = await db.entity.find(where).count()
    let items
    if (page) {
        items = await db.entity.find(where).skip(page.skip).limit(page.limit).populate(populate)
    } else {
        items = await db.entity.find(where).populate(populate)
    }

    return {
        count: count,
        items: items
    }
}
