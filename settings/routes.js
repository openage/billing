'use strict'
const auth = require('../helpers/auth')
const apiRoutes = require('@open-age/express-api')
const fs = require('fs')
const loggerConfig = require('config').get('logger')
const appRoot = require('app-root-path')

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

    app.get('/logs', function (req, res) {
        var filePath = appRoot + '/' + loggerConfig.file.filename

        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.contentType('application/json')
            res.send(data)
        })
    })

    var api = apiRoutes(app)

    api.model('organizations').register('REST', auth.requiresAdmin)
    api.model('taxes').register('REST', auth.requiresAdmin)
    api.model('payments').register('REST', auth.requiresEmployee)
    api.model('gateways').register('REST', auth.requiresEmployee)
    api.model('users').register('REST', auth.requiresEmployee)
    api.model('summaries').register([{
        action: 'GET',
        method: 'get',
        url: '/:id',
        filter: auth.requiresEmployee
    }])

    // api.model({
    //     root: ':entityType/:entityTypeId/settings',
    //     controller: 'settings'
    // }).register([{
    //     action: 'POST',
    //     method: 'create',
    //     filter: auth.requiresEmployee
    // }])
    api.model('settings').register([{
        action: 'POST',
        method: 'create',
        filter: auth.requiresEmployee
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        filter: auth.requiresEmployee
    }])
    api.model('entities').register([{
        action: 'POST',
        method: 'create',
        filter: auth.requiresEmployee
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        filter: auth.requiresEmployee
    }])
    api.model('invoices').register([{
        action: 'POST',
        method: 'create',
        filter: auth.requiresEmployee
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        filter: auth.requiresEmployee
    }, {
        action: 'GET',
        method: 'search',
        filter: auth.requiresEmployee
    }])

    api.model('hooks')
        .register([{
            action: 'POST',
            method: 'organizationUpdate',
            url: '/organization/update',
            filter: auth.requiresEmployee
        }])

    logger.end()
}
