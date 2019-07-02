const gateway = require('./gateways')
const payment = require('./payments')
const file = require('./files')

module.exports = {
    id: 'string',
    amount: 'number',
    code: 'string',
    mode: 'string',
    details: 'object',
    gateway: {
        id: 'string',
        code: 'string'
    },
    payment: {
        id: 'string'
    },
    file: file,
    status: 'string'
}