module.exports = [{
    url: '/',
    post: {
        parameters: ['x-role-key']
    },
    get: {
        parameters: [
            'x-role-key',
            { name: 'organizationId', in: 'query', description: 'organization id or code', required: false, type: 'string' }]
    }
}]