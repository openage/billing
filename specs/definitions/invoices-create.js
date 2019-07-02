const entity = require('./entities')
module.exports = {
    amount: {
        $type: Number,
        $description: `calculated if null`
    },
    taxes: [{
        type: {
            code: String
        },
        amount: Number // calculated if null
    }],
    discount: {
        type: {
            code: String
        },
        amount: Number
    },
    date: Date, // default today
    dueDate: Date, // default same as date
    lineItems: [{
        parts: [{ // maps to rate
            code: String, // rate code
            amount: Number // calculated from rate
        }],
        taxes: [{
            type: {
                code: String
            },
            amount: Number // calculated if null
        }],
        discount: {
            type: {
                code: String
            },
            amount: Number // calculated if null
        },
        units: Number, // will be used to calculate the amount
        entity: entity
    }],
    tags: [String],
    buyer: { // pass full model to create one
        role: {
            id: String
        }
    }
}
