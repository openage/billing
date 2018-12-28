'use strict'

const create = async (data, context) => {
    let log = context.logger.start('services/discounts:create')

    if (!data.organization) {
        data.organization = context.organization.id
    }

    if (!data.tenant) {
        data.tenant = context.tenant.id
    }

    let discount = await new db.discount(data).save()

    log.end()
    return discount
}

const getByCode = async (code, context) => {
    context.logger.start('services/discounts:getByCode')

    return db.discount.findOne({
        code: code,
        organization: context.organization
    })
}




exports.create = create
exports.getByCode = getByCode