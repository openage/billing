'use strict'
const mongoose = require('mongoose')

module.exports = {
    name: String,
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'head' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant' }
}
