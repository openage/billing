'use strict'
const mongoose = require('mongoose')

module.exports = {
    date: Date,
    amount: { type: Number, required: true },
    code: String, // payuid, cheque no,   // not available in case cash mode
    mode: {
        type: String,
        default: 'cash',
        enum: ['cash', 'cheque', 'online', 'card', 'wallet', 'ecs']
    },
    details: { type: Object },
    gateway: { type: mongoose.Schema.Types.ObjectId, ref: 'gateway' },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'invoice', required: true },
    file: { id: String, url: String, thumbnail: String },
    status: {
        type: String,
        default: 'started',
        enum: ['started', 'success', 'failed', 'refunded']
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    webUrl: String,
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true }
}
