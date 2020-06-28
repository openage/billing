'use strict'

exports.toModel = (entity, context) => {
    let details = []
    let amount = 0

    entity.lineItems.forEach(item => {
        amount = amount + item.amount
        details.push({
            amount: item.amount,
            transaction: {
                id: item.entity.entityId,
                linkedUser: {
                    id: entity.buyer.role.code
                },
                transactionType: {
                    id: item.entity.type.code
                },
                amount: item.amount
            }
        })
    })

    let data = {
        BankName: '',
        amount: amount,
        associatedUser: { id: entity.buyer.role.code },
        branchName: '',
        date: entity.date,
        details: details,
        mode: 'cash',
        modeNo: 0,
        trackingNo: null
    }

    return data
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
