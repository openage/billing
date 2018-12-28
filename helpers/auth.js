'use strict'

const contextBuilder = require('./context-builder')

const users = require('../services/users')

const fetch = (req, modelName, paramName) => {
    var value = req.query[`${modelName}-${paramName}`] || req.headers[`x-${modelName}-${paramName}`]
    if (!value && req.body[modelName]) {
        value = req.body[modelName][paramName]
    }
    if (!value) {
        return null
    }

    var model = {}
    model[paramName] = value
    return model
}

const extractUser = async (roleKey, logger) => {
    let log = logger.start('extractRoleKey')
    let user = await users.getFromDirectory(roleKey, logger)
    if (!user) {
        throw new Error('invalid role key')
    }

    log.end()
    return contextBuilder.create({
        user: user,
        organization: user.organization,
        tenant: user.tenant
    }, logger)
}

exports.requiresAdmin = (req, res, next) => {
    let log = res.logger.start('helpers/auth:requiresRoleKey')
    var role = fetch(req, 'role', 'key')

    if (!role) {
        log.end()
        return res.accessDenied('x-role-key is required.', 403)
    }

    extractUser(role.key, res.logger).then(context => {
        if (!context.hasPermission('admin')) {
            log.end()
            return res.accessDenied('insufficient permission', 403)
        }

        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        req.context = context
        next()
    }).catch(err => {
        log.error(err)
        log.end()
        res.accessDenied('invalid user', 403)
    })
}

exports.requiresEmployee = (req, res, next) => {
    let log = res.logger.start('requiresRoleKey')
    var role = fetch(req, 'role', 'key')

    if (!role) {
        log.end()
        return res.accessDenied('x-role-key is required.', 403)
    }

    extractUser(role.key, res.logger).then(context => {
        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        req.context = context
        next()
    }).catch(err => {
        log.error(err)
        log.end()
        res.accessDenied('invalid user', 403)
    })
}
