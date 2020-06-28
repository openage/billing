const webHook = require('../../../../helpers/web-hook')

exports.process = async (entity, context) => {
    await webHook.send('invoice', 'onStart', entity, context)
}
