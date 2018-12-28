'use strict'
const mongoose = require('mongoose')

module.exports = {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'gatewayProvider', required: true },
    config: { type: Object },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true }
}
