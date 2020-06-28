'use strict'
const formatter = require('../helpers/template').formatter

exports.success = async (payment, config) => {
    return                               // todo
}

exports.initiate = async (payment, config, context) => {
    let xmlFormatter = formatter(config.template)
    let data = xmlFormatter.inject(payment.toObject())
    return                               // todo
}

exports.refund = async (payment, config) => {
    return                               // todo
}