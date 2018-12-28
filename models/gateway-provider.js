'use strict'
module.exports = {
    code: { type: String, required: true },
    name: { type: String, required: true }, // payU, payTM, razorpay
    config: { type: Object },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    }
}
