'use strict'

exports.canCreate = async (req) => {
    if (!req.body) {
        return 'invalid request'
    }

    if (!req.body.amount) {
        return 'amount required'
    }

    if (!req.body.code && req.body.mode !== 'cash') {
        return 'code required'
    }

    if (!req.body.gateway && req.body.mode !== 'cash') {
        return 'provider required'
    }

    if (!req.body.invoice || !req.body.invoice.id) {
        return 'invoice required'
    }
}
