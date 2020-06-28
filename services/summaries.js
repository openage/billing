'use strict'

const invoiceService = require('./invoice')
const db = require('../models')

const moment = require('moment')
const ObjectId = require('mongodb').ObjectID

const get = async (id, context) => {
    let log = context.logger.start('services/summaries:get')
    let orgQuery = {}
    let summary = {}

    if (context.organization) {
        orgQuery.organization = ObjectId(context.organization.id)
    }

    let invoiceQuery = {
        seller: id,
        status: 'due'
    }

    summary.dueCount = await invoiceService.getCount(invoiceQuery, context)
    let groupItems = (await db.invoice.aggregate([{
        $match: {
            seller: ObjectId(id),
            status: 'due'
        }
    }, {
        $group: {
            _id: '$status',
            amount: { $sum: '$amount' }
        }
    }]))

    summary.dueAmount = groupItems.length ? groupItems[0].amount : 0

    summary.payments = []

    let tillDate = moment()
    let fromDate = moment().subtract(30, 'days')
    let date = fromDate

    for (date; date.isSameOrBefore(tillDate.endOf('day')); date.add(1, 'days')) {
        let onlineAmount = 0
        let cashAmount = 0
        let cardAmount = 0

        let startOfDay = date.startOf('day').toDate()
        let endOfDay = date.endOf('day').toDate()
        let oneDayPaymentDetails = await db.payment.aggregate([{
            $match: orgQuery
        }, {
            $match: {
                status: 'success',
                date: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            }
        }, {
            $lookup: {
                from: 'invoices',
                localField: 'invoice',
                foreignField: '_id',
                as: 'invoice'
            }
        }, { $unwind: '$invoice' }, {
            $match: {
                'invoice.seller': ObjectId(id)
            }
        }, {
            $group: {
                _id: '$mode',
                amount: { $sum: '$amount' }
            }
        }])

        if (oneDayPaymentDetails.length) {
            oneDayPaymentDetails.forEach(item => {
                switch (item._id) {
                    case 'online':
                        onlineAmount = item.amount
                        break
                    case 'cash':
                        cashAmount = item.amount
                    case 'card':
                        cardAmount = item.amount
                        break
                }
            })
        }
        summary.payments.push({
            date: startOfDay,
            onlineAmount: onlineAmount,
            cashAmount: cashAmount,
            cardAmount: cardAmount
        })
    }
    log.end()
    return summary
}

exports.get = get
