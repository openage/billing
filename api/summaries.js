'use strict'
const summaryService = require('../services/summaries')
const mapper = require('../mappers/summary')


exports.get = (req) => {
    let log = req.context.logger.start('api/summaries:get')

    let id = req.params.id === 'my' ? req.context.user.id : req.params.id

    return summaryService.get(id, req.context).then((summary) => {
        log.end()
        return mapper.toModel(summary)
    })
} 