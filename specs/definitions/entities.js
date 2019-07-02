module.exports = {
    id: 'string',
    type: {
        name: 'string', // appointments
        owner: {
            id: 'string', // abc
            type: {
                $type: 'string', // doctors
                $example: 'doctors',
                $description: 'the owner of the entity'
            }
        }
    }
}
