'use strict'
const invoiceService = require('../services/invoices')
const gatewayService = require('../services/gateways')
const mapper = require('../mappers/invoice')
const paging = require('../helpers/paging')

exports.create = async (req) => {
    let log = req.context.logger.start('api/invoices:create')

    let invoice = await invoiceService.create(req.body, req.context)
    log.end()
    return mapper.toModel(invoice)
}

exports.get = async (req) => {
    let log = req.context.logger.start('api/invoices:get')

    let invoice = await invoiceService.getById(req.params.id, req.context)
    if (invoice.status == 'due') {
        let gatewayList = await gatewayService.getOrgOrTenantGateways({
            tenant: invoice.tenant,
            organization: invoice.organization
        }, req.context)
        invoice.gateways = gatewayList   //todo organization gateways
    }
    log.end()
    return mapper.toModel(invoice)
}

const checkPermission = (permissions, context) => {
    let list = []
    list = permissions.filter(value => {
        return context.permissions.findIndex(function (element) {
            return element.split('.')[1] === value
        }) !== -1
    })

    return list.length ? true : false
}

exports.update = async (req) => {
    let log = req.context.logger.start('api/invoices:update')

    let invoice = await invoiceService.update(req.body, req.params.id, req.context)
    log.end()
    return mapper.toModel(invoice)
}

exports.search = async (req) => {
    let log = req.context.logger.start('api/invoices:search')

    let query = {}
    let sortQuery = {
        date: -1
    }

    if (req.query.status) {
        query.status = req.query.status
    }

    if (req.query.date) {
        query.date = req.query.date
    }

    if (req.query.organizationId) {
        query.organization = (await organizationService.get(req.query.organizationId, req.context)).id
    }

    if (!req.context.organization) {
        query.buyer = req.context.user.id
    } else {
        let hasPermission = checkPermission(['admin', 'receptionist'], req.context)
        if (!hasPermission) {
            query.seller = req.context.user.id
        }
        query.organization = req.context.organization.id
    }

    let where = db.invoice.find(query).populate('buyer seller lineItems.entity').sort(sortQuery)

    let pageInput = paging.extract(req)

    let invoiceList = await (pageInput ? where.skip(pageInput.skip).limit(pageInput.limit) : where)

    let page = {
        items: mapper.toSearchModel(invoiceList)
    }

    if (pageInput) {
        page.total = await where.count()
        page.pageNo = pageInput.pageNo
        page.pageSize = pageInput.limit
    }

    log.end()
    return page

}
