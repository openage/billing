'use strict'

const eduConfig = require('config').get('providers.edu')
const Client = require('node-rest-client-promise').Client
const client = new Client()
const entityService = require('../services/entities')

const getInvoice = (req, context) => {
    let log = context.logger.start('edu:getInvoice')

    let args = {
        headers: {
            'x-role-key': context.role.key
        }
    }

    var rollNo = req.rollNo

    if (req.buyer && req.buyer.role && req.buyer.role.code) {
        rollNo = req.buyer.role.code
    }

    // TODO: get pending items only
    const url = `${eduConfig.url}/transactions/search/121031?f[0][f]=Student_RollNo&f[0][o]=eq&f[0][v]=${rollNo}`
    log.info(`getting transactions from ${url}`)

    return new Promise((resolve, reject) => {
        return client.get(url, args, (data, response) => {
            if (!data || !data.isSuccess) {
                return reject(new Error())
            }

            let user = data.items[0].linkedUser

            let model = {}
            model.buyer = {
                phone: user.mobile, // TODO:
                email: user.email, // TODO:
                profile: {
                    firstName: user.name, // TODO:
                    lastName: '' // TODO:
                },
                role: {
                    code: user.id
                }
            }

            model.lineItems = []

            data.items.forEach(txn => {
                if (txn.status === 'Pending') {
                    model.lineItems.push({
                        id: txn.id,
                        code: txn.transactionNo,
                        entity: {
                            entityId: txn.id,
                            type: {
                                code: txn.transactionType.id
                            }
                        },
                        parts: [{
                            code: 'fixed',
                            amount: txn.dueAmount
                        }],
                        description: txn.transactionType.name
                    })
                }
            })
            log.end()
            return resolve(model)
        })
    })
}

const updateInvoice = async (invoice, context) => {
    let log = context.logger.start('edu:updateInvoice')

    let details = []
    let amount = 0

    async function asyncForEach (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    await asyncForEach(invoice.lineItems, async (item) => {
        amount = amount + item.amount
        item.entity = await entityService.get(item.entity, context)
        details.push({
            amount: item.amount,
            transaction: {
                id: item.entity.entityId,
                linkedUser: {
                    id: invoice.buyerCode
                },
                transactionType: {
                    id: item.entity.type.code
                },
                amount: item.amount
            }
        })
    })

    let args = {
        headers: {
            'x-role-key': context.role.key,
            'Content-Type': 'application/json'
        },
        data: {
            BankName: '',
            amount: amount,
            associatedUser: { id: invoice.buyerCode },
            branchName: '',
            date: invoice.date,
            details: details,
            mode: 'cash',
            modeNo: 0,
            trackingNo: null
        }
    }
    const url = `${eduConfig.url}/receipts/create`

    return client.postPromise(url, args).then(data => {
        if (!data || !data.response) {
            throw new Error()
        }
        log.end()
        return data.data
    })
}

exports.getInvoice = getInvoice
exports.updateInvoice = updateInvoice
