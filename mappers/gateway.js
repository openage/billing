'use strict'

exports.toModel = (entity) => {
    let model = {
        id: entity.id,
        status: entity.status,
        config: entity.config
    }

    if (entity.provider) {
        model.provider = entity.provider._doc ? {
            id: entity.provider.id,
            name: entity.provider.name,
            code: entity.provider.code,
            status: entity.provider.status
        } : {
                id: entity.provider.toString()
            }
    }

    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            name: entity.organization.name,
            code: entity.organization.code,
            address: entity.organization.address
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
}


exports.toSearchModel = (entities) => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}