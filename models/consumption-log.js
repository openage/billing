'use strict'

const mongoose = require('mongoose')

// units would be fetched from the service and logged here
// alternatively service would log consumed units here
module.exports = {
    quantity: Number,
    from: Date,
    till: Date,
    status: {
        type: String,
        default: 'un-billed',
        enum: ['un-billed', 'invoiced']
    },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'invoice' },
    entity: { type: mongoose.Schema.Types.ObjectId, ref: 'entity' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant' }
}
