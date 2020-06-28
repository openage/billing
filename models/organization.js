'use strict'
const mongoose = require('mongoose')
module.exports = {
    code: { type: String, lowercase: true },
    name: String,
    shortName: String,
    logo: {
        url: String,
        thumbnail: String
    },
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
    services: [{
        logo: String,
        code: String,
        name: String,
        description: String,
        url: String, // api root url
        apps: {
            web: String,
            android: String,
            iOS: String
        },
        config: Object,
        hooks: {
            invoice: {
                config: Object,
                onCreate: {
                    url: String,
                    action: String
                },
                onPaid: {
                    url: String,
                    action: String
                }
            }
        }
    }],
    currencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'currency' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
        // or required: true
    }
}
