'use strict'
const mongoose = require('mongoose')

module.exports = {
    entityId: { type: String, required: true }, // id , product.id, appointment.id
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'entityType', required: true }, // appointments, medicines
    name: String, // (crocin)
    description: String,
    pic: {
        url: String,
        thumbnail: String
    },
    consumption: {
        quantity: Number,
        from: Date,
        till: Date,
        fetch: {
            url: String,
            date: Date
        }
    },
    billing: {
        auto: Boolean, // if auto, the un-billed units are invoiced
        lastDate: Date, // date of last billing
        periodicity: {
            period: Number,
            startDate: Date,
            type: {
                type: String,
                default: 'once',
                enum: ['once', 'daily', 'weekly', 'monthly', 'annually']
            }
        },
        buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
    },
    rate: [{
        code: String, // price (if not there gets from parent)
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

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },

    qualifier: {
        key: String,  // agent
        value: String, // agent Id
        condition: {
            type: String,
            default: 'eq',
            enum: ['eq', 'neq', 'lt', 'gt']
        }
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true }
}
