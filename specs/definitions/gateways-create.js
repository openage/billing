const tenant = require('./tenants')
const organization = require('./organizations')
const provider = require('./providers')

module.exports = {
    provider: provider,
    config: {},
    status: 'string',
    organization: organization,
    tenant: tenant
}