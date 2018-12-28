'use strict'

const mongoose = require('mongoose')

module.exports = {
    amount: Number,
    otp: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant' }
}
