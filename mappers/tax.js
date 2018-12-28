'use strict'

exports.toModel = (entity) => {
    let model = {
        name: entity.name,
        categories: entity.categories,
        value: entity.value,
        type: entity.type
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

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}