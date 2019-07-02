const billing = require('./billings')
const rate = require('./rates')
const qualifier = require('./qualifiers')

module.exports = {
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
    qualifier: qualifier
}