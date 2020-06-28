'use strict'

const mongoose = require('mongoose')

module.exports = {
    phone: String,
    email: String,
    profile: {
        firstName: String,
        lastName: String,
        dob: Date,
        gender: String,
        pic: {
            url: String,
            thumbnail: String
        }
    },
    qualifications: Object, // basis on which the rates would be applied
    role: {
        id: { type: String },
        code: String,
        key: String,
        permissions: []
    },
    bankDetails: {
        name: { type: String },
        account: { type: String },
        branch: { type: String },
        ifscCode: { type: String }
    },
    pan: String,
    aadhar: String,
    address: {
        line1: String,
        line2: String,
        district: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
    },
    currency: { type: mongoose.Schema.Types.ObjectId, ref: 'currency' },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
    }
}
