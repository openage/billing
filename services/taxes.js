'use strict'
const db = require('../models')

const updateScheme = require('../helpers/update')

const create = async (model, context) => {
    context.logger.start('services/taxes:create')

    if (!model.tenant) {
        model.tenant = context.tenant.id
    }
    return new db.tax(model).save()
}

const getById = async (id, context) => {
    context.logger.start('services/taxes:getById')

    return db.tax.findById(id)
}

const update = async (model, id, context) => {
    let log = context.logger.start('services/taxes:update')

    let tax = await getById(id, context)

    let updatedTax = await updateScheme.update(model, tax).save()

    log.end()
    return updatedTax
}

exports.create = create
exports.update = update
exports.getById = getById
