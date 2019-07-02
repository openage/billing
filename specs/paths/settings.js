
module.exports = [{
    url: '/',
    post: {
        parameters: [
            'x-role-key',
            {
                name: 'body', in: 'body', required: true, schema: {
                    '$ref': '#/definitions/settingsCreateReq'
                }
            }
        ]
    },
    get: {
        summary: 'GET',
        description: 'get',
        operationId: 'get-settings',
        parameters: [
            'x-role-key',
        ]
    }
}, {
    url: '/{id}',
    get: {
        summary: 'GET',
        description: 'get by id',
        operationId: 'get-settings',
        parameters: [
            'x-role-key',
            { in: 'path', name: 'id', description: 'setting id', type: 'string', required: true }
        ]
    }
}]
