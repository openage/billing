'use strict'

exports.canCreate = async (req) => {
    if (!req.body.code) {
        return 'code required'
    }

}