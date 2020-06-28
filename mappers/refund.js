'use strict'

exports.toModel = (entity, context) => {
    let model = {
        id: entity.id || entity._id.toString(),
        amount: entity.amount,
        code: entity.code,
        model: entity.model,
        status: entity.status
    }

    return model
}

exports.toSearchModel = (entities) => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
