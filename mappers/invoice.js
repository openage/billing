'use strict'

const profileMapper = require('./profile')

exports.toModel = (entity) => {
    let model = {
        id: entity.id,
        code: entity.code,
        amount: entity.amount,
        dueAmount: entity.dueAmount,
        date: entity.date,
        dueDate: entity.dueDate,
        status: entity.status,
        tags: entity.tags,
    }

    if (entity.lineItems && entity.lineItems.length) {
        model.lineItems = entity.lineItems.map(item => {
            let obj = {
                amount: item.amount
            }
            if (item.consumption) {
                obj.consumption = {
                    quantity: item.consumption.quantity,
                    from: item.consumption.from,
                    till: item.consumption.till
                }
            }
            if (item.entity) {
                obj.entity = item.entity._doc ? {
                    id: item.entity.id,
                    name: item.entity.name
                } : {
                        id: item.entity.toString()
                    }
            }
            if (item.taxes && item.taxes.length) {
                obj.taxes = item.taxes         //todo
            }
            if (item.discount) {
                obj.discount = item.discount._doc ? {
                    id: item.discount.id             //todo
                } : {
                        id: item.discount.toString()
                    }
            }
            return obj
        })
    }

    if (entity.buyer) {
        model.buyer = entity.buyer._doc ? {
            id: entity.buyer.id,
            phone: entity.buyer.phone,
            email: entity.buyer.email,
            profile: profileMapper.toModel(entity.buyer.profile)
        } : {
                id: entity.buyer.toString()
            }
    }

    if (entity.seller) {
        model.seller = entity.seller._doc ? {
            id: entity.seller.id,
            phone: entity.seller.phone,
            email: entity.seller.email,
            profile: profileMapper.toModel(entity.seller.profile)
        } : {
                id: entity.seller.toString()
            }
    }

    if (entity.order) {
        model.order = {
            id: entity.order.id,
            code: entity.order.code
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

    if (entity.gateways && entity.gateways.length) {
        model.gateways = entity.gateways.map(gateway => {
            let model = {}
            if (gateway._doc) {
                model.id = gateway.id
                model.status = gateway.status
                model.config = {
                    key: gateway.config.key
                }
                model.provider = {}
                if (gateway.provider._doc) {
                    model.provider.id = gateway.provider.id
                    model.provider.code = gateway.provider.code
                    model.provider.name = gateway.provider.name
                    model.provider.status = gateway.provider.status
                } else {
                    model.provider.id = gateway.provider.toString()
                }
            } else {
                model.id = gateway.toString()
            }
            return model
        })
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
