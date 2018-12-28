'use strict'

exports.toModel = (entity) => {
    let model = {
        id: entity.id || entity._id.toString(),
        name: entity.name,
        code: entity.code,
        value: entity.value,
        type: entity.type,
        expiry: entity.expiry,
        limit: entity.limit,
        count: entity.count,
        status: entity.status
    }

    if (entity.qualifications && entity.qualifications.length) {
        model.qualifications = entity.qualifications.map((qualification) => {
            return {
                field: qualification.field,
                operator: qualification.operator,
                value: qualification.value
            }
        })
    }

    if (entity.entityType) {
        model.entityType = entity.entityType._doc ? {
            id: entity.entityType.id,
            code: entity.entityType.code
        } : {
                id: entity.entityType.toString()
            }
    }

    if (entity.user) {
        model.user = entity.user._doc ? {
            id: entity.user.id,
            phone: entity.user.phone,
            email: entity.user.email
        } : {

            }
    }
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}