'use strict'

module.exports = {
    code: { type: String, required: true }, // INR
    name: { type: String, required: true }, // Rupees
    symbol: { type: String, required: true }, // R
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    }
}
