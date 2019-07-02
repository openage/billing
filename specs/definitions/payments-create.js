const gateway = require('./gateways')
const invoice = require('./invoices')
const organization = require('./organizations')
const file = require('./files')

module.exports = {
    amount: 'string',
    code: 'string',
    mode: 'string',
    file: file,
    details: {
        commission: 'number',
        bank: 'string',
        branch: 'string'
    },
    type: 'string',
    gateway: {
        id: 'string',
        code: 'string'
    },
    invoice: {
        id: 'string'
    },
    status: 'string',
    organization: {
        id: 'string',
        code: 'string'
    }
}