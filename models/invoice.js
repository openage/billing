'use strict'
const mongoose = require('mongoose')

module.exports = {
    code: { type: String, required: true }, // will be auto generated
    order: {
        id: String,
        code: String
    },
    amount: {
        type: Number,
        min: 0,
        required: true
    },
    dueAmount: {
        type: Number,
        min: 0
    },
    taxes: [{
        amount: Number,
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'tax' }
    }],
    discount: [{
        amount: Number,
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'discount' }
    }],
    date: Date,
    dueDate: Date,
    lineItems: [{
        amount: Number, // total of products price after tax
        parts: [{ // maps to rate
            code: String, // fixed, per-minute etc
            description: String,
            amount: Number
        }],
        taxes: [{
            amount: Number,
            type: { type: mongoose.Schema.Types.ObjectId, ref: 'tax' }
        }],
        discount: {
            amount: Number,
            type: { type: mongoose.Schema.Types.ObjectId, ref: 'discount' }
        },
        consumption: {
            quantity: { type: Number, min: 0 },
            from: Date,
            till: Date
        },
        entity: { type: mongoose.Schema.Types.ObjectId, ref: 'entity' },
        description: String,
        details: String
    }],
    currency: {
        conversion: Number, // wrt $
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'currency' }
    },
    tags: [String],
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        default: 'due',
        enum: ['draft', 'due', 'over-due', 'paid', 'write-off', 'cancelled']
    },
    service: {
        code: String
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant', required: true }
}
