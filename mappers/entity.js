'use strict'

exports.toModel = (entity, context) => {
    let model = {
        id: entity.id || entity._id.toString(),
        entityId: entity.entityId,
        name: entity.name,
        description: entity.description,
        status: entity.status
    }

    if (entity.pic) {
        model.pic = {
            url: entity.pic.url,
            thumbnail: entity.pic.thumbnail
        }
    }

    if (entity.consumption) {
        model.consumption = {
            quantity: entity.consumption.quantity,
            from: entity.consumption.from,
            till: entity.consumption.till
        }
        if (entity.consumption.fetch) {
            model.consumption.fetch = {
                url: entity.consumption.fetch.url,
                date: entity.consumption.fetch.date
            }
        }
    }

    if (entity.billing) {
        model.billing = {
            auto: entity.billing.auto,
            lastDate: entity.billing.lastDate
        }
        if (entity.billing.periodicity) {
            model.billing.periodicity = {
                period: entity.billing.periodicity.period,
                startDate: entity.billing.periodicity.startDate,
                type: entity.billing.periodicity.type
            }
        }
        if (entity.billing && entity.billing.length) {
            model.billing.buyers = entity.billing.buyers.map((buyer) => {
                return buyer._doc ? {
                    id: buyer.id,
                    phone: buyer.phone,
                    email: buyer.email,
                    profile: buyer.profile,
                    address: buyer.address
                } : {
                        id: buyer.toString()
                    }
            })
        }
    }

    if (entity.rate) {
        model.rate = entity.rate.map((item) => {
            return {
                code: item.code,
                description: item.description,
                value: item.value,
                status: item.status
            }
        })
    }

    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            name: entity.organization.name,
            shortName: entity.organization.shortName,
            code: entity.organization.code
        } : {
                id: entity.organization.toString()
            }
    }

    if (entity.tenant) {
        model.tenant = entity.tenant._doc ? {
            id: entity.tenant.id,
            name: entity.tenant.name,
            code: entity.tenant.code
        } : {
                id: entity.tenant.toString()
            }
    }

    return model
}

exports.toSearchModel = (entities) => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
