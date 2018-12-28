'use strict'
const userService = require('../services/users')
const mapper = require('../mappers/user')

exports.update = async (req) => {
    let log = req.context.logger.start("api/users:update")

    const id = req.params.id === 'my' ? req.context.user.id : req.params.id

    let user = await userService.update(req.body, id, req.context)

    log.end()
    return mapper.toModel(user)
}

exports.get = async (req) => {
    let log = req.context.logger.start("api/users:get")

    const id = req.params.id === 'my' ? req.context.user.id : req.params.id

    let user = await userService.getById(id, req.context)

    log.end()
    return mapper.toModel(user)
}