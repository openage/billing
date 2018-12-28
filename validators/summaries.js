'use strict'

const canGet = async (req) => {
    if (!req.params.id) {
        return 'id required'
    }
}