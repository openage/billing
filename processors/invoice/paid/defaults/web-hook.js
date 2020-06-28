const webHook = require('../../../../helpers/web-hook')
const service = require('../../../../services/invoice')

exports.process = async (data, context) => {
    if (!data || !data.id) {
        return
    }

    let invoice = await service.getById(data.id, context)

    await webHook.send({
        entity: 'invoice',
        action: 'onPaid',
        when: 'after'
    }, invoice, context)
}
