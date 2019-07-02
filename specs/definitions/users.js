const currency = require('./currencies')
const bankDetails = require('./bank-details')
module.exports = {
    id: 'string',
    qualifications: 'object',
    bankDetails: bankDetails,
    currency: currency,
    role: { id: 'string' },
    address: {
        line1: 'string',
        line2: 'string',
        district: 'string',
        city: 'string',
        state: 'string',
        pinCode: 'string',
        country: 'string'
    }
}
