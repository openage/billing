'use strict'
const db = require('../models')

const update = async (id, model, context) => {
    let tenant = await db.tenant.findById(id)

    for (let key in model) {
        tenant[key] = model[key]
    }

    return tenant.save()
}

const create = async (model, context) => {
    context.logger.info(`creating tenant ${model.code}`)
    let tenant = new db.tenant(model)

    return tenant.save()
}

const get = async (query, context) => {
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.tenant.findById(query)
        }
        return db.tenant.findOne({
            code: query
        })
    }
    if (query.id) {
        return db.tenant.findById(query.id)
    }
    if (query.code) {
        return db.tenant.findOne({
            code: query.code
        })
    }
    return null
}

const getByCode = async (code, context) => {
    return db.tenant.findOne({ code: code })
}

exports.get = get
exports.getByCode = getByCode
exports.update = update
exports.create = create
