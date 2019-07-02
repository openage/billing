let billing = require('./billings')
let rate = require('./rates')
let tenant = require('./tenants')
let organization = require('./organizations')

module.exports = {
    name: 'string',
    billing: billing,
    rate: rate,
    owner: {
        id: 'string',
        type: 'string'
    },
    status: 'string',
    organization: organization,
    tenant: tenant

}
