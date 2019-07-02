const billing = require('./billings')
const rate = require('./rates')

module.exports = {
    entityId: String,
    type: {
        id: 'string',
        code: 'string'
    },
    name: 'string',
    description: 'string',
    pic: {
        url: 'string',
        thumbnail: 'string'
    },
    consumption: {
        quantity: 'number',
        from: 'date',
        till: 'date',
        fetch: {
            url: 'string',
            date: 'date'
        }
    },
    billing: billing,
    rate: [rate],
    status: 'string'
}