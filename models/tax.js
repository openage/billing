'use strict'

const mongoose = require('mongoose')

module.exports = {
    name: String, // GST, Cess
    categories: [String], // applicable on entities  of category
    value: Number,
    type: {
        type: String, // '%', 'value'
        default: '%',
        enum: ['value', '%', 'units']
    },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant' }
}
