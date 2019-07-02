'use strict'

const mongoose = require('mongoose')

module.exports = {
    name: String, // waiver, coupon, referral, membership
    code: String,
    value: Number, // 200 Rs, 10%, 5 Rs for 10 units
    type: {
        type: String, // '%', 'value'
        default: 'value',
        enum: ['value', '%', 'units', 'flex']
    },
    expiry: Date, // not valid after
    limit: Number, // no of usages
    count: Number, // no of times used
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    qualifications: [{
        field: String, // Category,
        operator: {
            type: String,
            default: 'eq',
            enum: ['eq', 'lt', 'gt', 'neq']
        },
        value: String // BPL
    }],
    entityType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'entityType'
    },
    user: { // user specific coupon or discount
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
