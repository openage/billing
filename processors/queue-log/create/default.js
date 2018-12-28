'use strict'

const offline = require('@open-age/offline-processor')
const queueLogService = require('../../../services/queue-logs')

exports.process = async (data, context) => {
    context.logger.start('processors:queue-log:create')

    const queueLog = await queueLogService.getById(data.id, context)

    if (!queueLog) { return }

    await offline.queue(queueLog.entity, queueLog.action, { id: queueLog.id }, context)
}