'use strict'
const mongoose = require('mongoose')

module.exports = {

    code: String, // price
    description: String,
    value: Number,
    type: {
        type: String,
        default: 'fixed',
        enum: ['fixed', 'metered']
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },

    qualifiers: [{
        key: String,  // agent
        value: String, // agent Id
        condition: {
            type: String,
            default: 'eq',
            enum: ['eq', 'neq', 'lt', 'gt']
        }
    }],
    service: {
        code: String
    },
    entityType: { type: mongoose.Schema.Types.ObjectId, ref: 'entityType' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true }
}
