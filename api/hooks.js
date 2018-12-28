'use strict'
const queueLogService = require('../services/queue-logs')
const offline = require('@open-age/offline-processor')

exports.organizationUpdate = async (req) => {
    let log = req.context.logger.start('api/hooks:organizationUpdate')

    req.context.processSync = true

    const queueLogModel = {
        entity: 'organization',
        action: 'sync',
        data: req.body,
        context: req.context
    }

    const queueLog = await queueLogService.create(queueLogModel, req.context)

    await offline.queue('queueLog', 'create', { id: queueLog.id }, req.context)

    return 'organization updated'
}