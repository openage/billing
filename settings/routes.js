'use strict'
const contextBuilder = require('../helpers/context-builder')
const apiRoutes = require('@open-age/express-api')
const fs = require('fs')

const specs = require('../specs')

module.exports.configure = (app, logger) => {
    logger.start('settings/routes:configure')

    let specsHandler = function (req, res) {
        fs.readFile('./public/specs.html', function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.contentType('text/html')
            res.send(data)
        })
    }

    app.get('/', specsHandler)

    app.get('/specs', specsHandler)

    app.get('/api/specs', function (req, res) {
        res.contentType('application/json')
        res.send(specs.get())
    })

    var api = apiRoutes(app, { context: { builder: contextBuilder.create } })

    api.model('organizations').register('REST', { permissions: 'tenant.user' })
    api.model('taxes').register('REST', { permissions: 'tenant.user' })
    api.model('gateways').register('REST', { permissions: 'tenant.user' })
    api.model('users').register('REST', { permissions: 'tenant.user' })
    api.model('summaries').register([{
        action: 'GET',
        method: 'get',
        url: '/:id',
        permissions: 'tenant.user'
    }])

    // api.model({
    //     root: ':entityType/:entityTypeId/settings',
    //     controller: 'settings'
    // }).register([{
    //     action: 'POST',
    //     method: 'create',
    //     permissions: 'tenant.user'
    // }])
    api.model('settings').register([{
        action: 'POST',
        method: 'create',
        permissions: 'tenant.user'
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        permissions: 'tenant.user'
    }])
    api.model('entities').register([{
        action: 'POST',
        method: 'create',
        permissions: 'tenant.user'
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        permissions: 'tenant.user'
    }])
    api.model('invoices').register([{
        action: 'POST',
        method: 'create',
        permissions: 'tenant.user'
    }, {
        action: 'PUT',
        method: 'update',
        url: '/:id',
        permissions: 'tenant.user'
    }, {
        action: 'GET',
        method: 'search',
        permissions: 'tenant.user'
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        permissions: 'tenant.user'
    }])

    api.model('payments').register([{
        action: 'POST',
        method: 'create',
        permissions: 'tenant.user'
    }, {
        action: 'POST',
        method: 'start',
        url: '/:id/start',
        permissions: 'tenant.user'
    }, {
        action: 'POST',
        method: 'capture',
        url: '/:id/capture',
        permissions: 'tenant.user'
    }, {
        action: 'PUT',
        method: 'update',
        url: '/:id',
        permissions: 'tenant.user'
    }, {
        action: 'GET',
        method: 'search',
        permissions: 'tenant.user'
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        permissions: 'tenant.user'
    }])

    api.model('easyPay').register([{
        action: 'POST',
        method: 'update',
        permissions: 'tenant.user'
    }, {
        action: 'GET',
        method: 'create',
        url: '/:id',
        permissions: 'tenant.user'
    }])

    api.model('hooks')
        .register([{
            action: 'POST',
            method: 'organizationUpdate',
            url: '/organization/update',
            permissions: 'tenant.user'
        }])

    logger.end()
}
