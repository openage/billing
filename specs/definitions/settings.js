const billing = require('./billings')
const rate = require('./rates')
const qualifier = require('./qualifiers')
const organization = require('./organizations')
const tenant = require('./tenants')

module.exports = {
    id: 'string',
    code: 'string',
    name: 'string',
    description: 'string',
    category: 'string',
    pic: {
        url: 'string',
        data: 'string'
    },
    billing: billing,
    rate: [rate],
    status: 'string',
    service: {
        code: 'string'
    },
    qualifier: qualifier,
    organization: organization,
    tenant: tenant
}