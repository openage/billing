'use strict'
const profileMapper = require('./profile')

exports.toModel = (entity) => {
    let model = {
        id: entity.id,
        phone: entity.phone,
        email: entity.email,
        pan: entity.pan,
        aadhar: entity.aadhar
    }

    if (entity.profile) {
        model.profile = profileMapper.toModel(entity.profile)
    }

    if (entity.bankDetails) {
        model.bankDetails = entity.bankDetails
    }

    return model
}