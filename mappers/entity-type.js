'use strict'

exports.toModel = (entity, context) => {
    let model = {
        id: entity.id || entity._id.toString(),
        code: entity.code,
        name: entity.name,
        status: entity.status,
        category: entity.category
    }

    if (entity.pic) {
        model.pic = {
            url: entity.pic.url,
            thumbnail: entity.pic.thumbnail
        }
    }

    if (entity.billing) {
        model.billing = {
            auto: entity.billing.auto
        }
        if (entity.billing.periodicity) {
            model.billing.periodicity = {
                period: entity.billing.periodicity.period,
                startDate: entity.billing.periodicity.startDate,
                type: entity.billing.periodicity.type
            }
        }
        if (entity.billing.consumption) {
            model.billing.consumption = {
                url: entity.billing.consumption.url
            }
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

    if (entity.owner) {
        model.owner = {
            id: entity.owner.id,
            type: entity.owner.type
        }
    }

    if (entity.service) {
        model.service = {
            code: entity.service.code
        }
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
