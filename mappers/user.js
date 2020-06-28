'use strict'
const profileMapper = require('./profile')

exports.toModel = (entity, context) => {
    if (!entity) {
        return
    }
    if (!entity._doc) {
        return {
            id: entity.toString()
        }
    }
    const model = {
        id: entity.id,
        code: entity.code,
        phone: entity.phone,
        email: entity.email,
        profile: profileMapper.toModel(entity.profile, context),
        pan: entity.pan,
        aadhar: entity.aadhar
    }

    if (entity.bankDetails) {
        model.bankDetails = entity.bankDetails
    }

    return model
}
