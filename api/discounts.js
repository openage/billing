'use strict'

const discountService = require('../services/discounts')
const mapper = require('../mappers/discount')

exports.create = async (req) => {
    let log = req.context.logger.start('api/discounts:create')

    let sameCodeDiscount = await discountService.getByCode(req.body.code, req.context)

    if (sameCodeDiscount) {
        throw new Error('discount with same code already exist')
    }

    let discount = await discountService.create(req.body, req.context)
    log.end()
    return mapper.toModel(discount)
}

exports.get = async (req) => {
    let log = req.context.logger.start('api/discounts:get')

    let discount = await discountService.getById(req.params.id, req.context)
    log.end()
    return mapper.toModel(discount)
}

exports.search = async (req) => {
    let log = req.context.logger.start('api/discounts:search')

    let query = {}

    if (req.query.entityType) {
        query.entityType = req.query.entityType
    }

    let discountList = await db.discount.find(query)

    return mapper.toSearchModel(discountList)
}