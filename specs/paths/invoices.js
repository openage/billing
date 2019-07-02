module.exports = [{
    url: '/',
    post: {
        parameters: ['x-role-key']
    },
    get: {
        parameters: [
            'x-role-key',
            { name: 'organizationId', in: 'query', description: 'organization id or code', required: false, type: 'string' },
            { name: 'status', in: 'query', description: 'invoice status like paid due draft', required: false, type: 'string' },
            { name: 'date', in: 'query', description: 'date in utc format', required: false, type: 'string' },
            { name: 'pageNo', in: 'query', description: 'pageNo', required: false, type: 'number' },
            { name: 'serverPaging', in: 'query', description: 'serverPaging', required: false, type: 'boolean' },
            { name: 'pageSize', in: 'query', description: 'pageSize', required: false, type: 'number' }
        ]
    }
}, {
    url: '/{id}',
    get: { parameters: ['x-role-key'] },
    put: { parameters: ['x-role-key'] }
}]
