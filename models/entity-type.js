'use strict'
const mongoose = require('mongoose')

module.exports = {
    code: { type: String, required: true }, // appointments:opd:id, medicines, medicines
    name: String, // OPD visit, medicines, medicines
    pic: {
        url: String,
        thumbnail: String
    },
    category: String,
    billing: {
        auto: Boolean,
        periodicity: {
            period: Number,
            startDate: Date,
            type: {
                type: String,
                default: 'once',
                enum: ['once', 'daily', 'weekly', 'monthly', 'annually']
            }
        },
        consumption: {
            url: String
        }
    },
    rate: [{
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
        }
    }],
    // owner: {
    //     id: String,
    //     type: { type: String } // doctors
    // },
    qualifier: {
        key: String,  // agent
        value: String, // agent Id
        condition: {
            type: String,
            default: 'eq',
            enum: ['eq', 'neq', 'lt', 'gt']
        }
    },
    service: {
        code: String
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true }
}
