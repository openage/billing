'use strict'

exports.create = async (req) => {
    if (!req.body) {
        return 'invalid request'
    }

    if (!req.body.order) {
        return 'order required'
    }

    if (!req.body.date) {
        return 'date required'
    }

    if (!req.body.lineItems || !req.body.lineItems.length) {
        return 'lineItems required'
    }

    if (!req.body.buyer) {
        return 'buyer required'
    }
}