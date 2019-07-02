const gateway = require('./gateways')
const invoice = require('./invoices')
const organization = require('./organizations')
const tenant = require('./tenants')

module.exports = {
    id: 'string',
    amount: 'string',
    code: 'string',
    mode: 'string',
    details: {
        commission: 'number',
        bank: 'string',
        branch: 'string'
    },
    type: 'string',
    gateway: gateway,
    invoice: invoice,
    status: 'string',
    organization: organization,
    tenant: tenant
}