'use strict'

exports.canCreate = async (req) => {
    if (!req.body) {
        return 'invalid request'
    }

    if (!req.body.code) {
        return 'code required'
    }

    //todo organization admin only
}