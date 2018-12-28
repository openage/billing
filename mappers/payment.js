'use strict'

exports.toModel = (entity) => {
    let model = {
        id: entity.id || entity._id.toString(),
        date: entity.date,
        amount: entity.amount,
        code: entity.code,
        mode: entity.mode,
        type: entity.type,
        status: entity.status
    }

    if (entity.details) {
        model.details = {
            commission: entity.details.commission,
            bank: entity.details.bank,
            branch: entity.details.branch
        }
    }

    if (entity.gateway) {
        if (entity.gateways_doc) {
            model.gateway = {
                id: entity.gateway.id
            }
        } else {
            model.gateway = {
                id: entity.gateway.toString()
            }
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




    return model
}