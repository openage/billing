// let users = require('./users')
module.exports = {
    auto: 'boolean',
    lastDate: 'date',
    periodicity: {
        period: 'number',
        startDate: 'date',
        type: 'string',
        consumption: {
            url: 'string'
        }
    },
    buyer: [{
        id: 'string'
    }]
}
