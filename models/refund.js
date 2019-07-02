'use strict'
const mongoose = require('mongoose')

module.exports = {
    date: Date,
    amount: { type: Number, required: true },
    code: String, // payuid, cheque no,   // not available in case cash mode
    mode: {
        type: String,
        default: 'cash',
        enum: ['cash', 'cheque', 'online', 'card', 'wallet']
    },
    details: { type: Object },
    gateway: { type: mongoose.Schema.Types.ObjectId, ref: 'gateway', required: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'invoice', required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'payment', required: true },
    file: { id: String, url: String, thumbnail: String },
    status: {
        type: String,
        default: 'started',
        enum: ['started', 'success', 'failed']
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true }
}
