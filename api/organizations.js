'use strict'
let organizations = require('../services/organizations')
let mapper = require('../mappers').organization

exports.get = async (req) => {
    let id = req.params.id === 'my' ? req.context.organization.id : req.params.id
    let org = await organizations.get(id, req.context)
    return mapper.toModel(org)
}

exports.update = async (req) => {
    let item = await organizations.update(req.params.id, req.body, req.context)
    return mapper.toModel(item)
}
