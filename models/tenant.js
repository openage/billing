'use strict'
const mongoose = require('mongoose')

module.exports = {
    code: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    lastInvoiceNo: {
        type: Number,
        default: 100000
    },
    name: String,
    config: Object,
    logo: {
        url: String,
        thumbnail: String
    },
    bankDetails: { // to receive funds from the organizations
        name: { type: String },
        account: { type: String },
        branch: { type: String },
        ifscCode: { type: String }
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },

    services: [{
        logo: String,
        code: String,
        name: String,
        url: String, // api root url
        hooks: { // after action happens
            invoice: {
                onCreate: String,
                onUpdate: String,
                onDelete: String
            },
            payment: {
                onCreate: String,
                onUpdate: String,
                onDelete: String
            }
        }
    }],
    currencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'currency' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}
