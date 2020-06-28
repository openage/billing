'use strict'

const profileMapper = require('./profile')

exports.toModel = (entity, context) => {
    let model = {
        code: entity.id,
        buyer_code: entity.buyer.role.code,
        buyer_type: 'student',
        buyer_phone: entity.buyer.phone,
        buyer_email: entity.buyer.email,
        buyer_name: entity.buyer.profile.firstName,
        amount: entity.amount,
        date: entity.date
    }

    if (entity.lineItems && entity.lineItems.length) {
        model.lineItems = entity.lineItems.map(item => {
            let obj = {
                '2': item.amount
            }
            if (item.entity) {
                obj.item_data = item.entity._doc ? {
                    code: item.entity.id
                } : {
                        code: item.entity.toString()
                    }
                obj.item_data.isRequired = true
                obj.item_data.partialPaymentAllowed = false
            }
            if (item.taxes && item.taxes.length) {
                obj['4'] = item.taxes // todo
            }
            if (item.discount) {
                obj['3'] = item.discount._doc ? {
                    id: item.discount.id // todo
                } : {
                        id: item.discount.toString()
                    }
            }
            if (item.description) {
                obj['1'] = item.description
            }
            return obj
        })
    }

    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            name: entity.organization.name,
            shortName: entity.organization.shortName,
            code: entity.organization.code
        } : {
                id: entity.organization.toString()
            }
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
