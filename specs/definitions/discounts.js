const organization = require('./organizations')
const tenant = require('./tenants')
const entityType = require('./entity-types')

module.exports = {
    id: 'string',
    name: 'string',
    code: 'string',
    value: 'number',
    type: 'string',
    expiry: 'date',
    limit: 'number',
    count: 'number',
    status: 'string',
    qualifications: [{
        field: 'string',
        operator: 'string',
        value: 'string'
    }],
    entityType: {
        id: 'string'
    },
    organization: organization,
    tenant: tenant
}