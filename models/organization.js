'use strict'
const mongoose = require('mongoose')
module.exports = {
    code: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    name: { type: String },
    shortName: String,
    config: Object,
    lastInvoiceNo: {
        type: Number,
        default: 100000
    },
    bankDetails: {
        name: { type: String },
        account: { type: String },
        branch: { type: String },
        ifscCode: { type: String }
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'new', 'inactive']
    },
    type: String,
    address: {
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        district: { type: String },
        pinCode: { type: String },
        state: { type: String },
        country: { type: String }
    },
    currencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'currency' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant',
        //or required: true
    }
}
