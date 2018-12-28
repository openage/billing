'use strict'

const create = (claims, logger) => {
    let role = claims.user.role
    let context = {
        logger: logger,
        permissions: role.permissions || [],
        role: role,
        user: claims.user,
        employee: claims.employee,
        organization: claims.organization,
        tenant: claims.tenant
    }

    let log = context.logger.start('context-builder:create')

    context.hasPermission = (permission) => {
        return context.permissions.find(item => item === permission)
    }

    context.where = () => {
        let clause = {}

        if (context.organization) {
            clause.organization = context.organization.id.toObjectId()
        }
        if (context.tenant) {
            clause.tenant = context.tenant.id.toObjectId()
        }
        let filters = {}

        filters.add = (field, value) => {
            if (value) {
                clause[field] = value
            }
            return filters
        }

        filters.clause = clause

        return filters
    }

    log.end()

    return context
}

exports.serializer = async (context) => {
    let serialized = {}

    if (context.role) {
        serialized.roleId = context.role.id
    }

    if (context.user) {
        serialized.userId = context.user.id
    }

    if (context.tenant) {
        serialized.tenantId = context.tenant.id
    }
    if (context.organization) {
        serialized.organizationId = context.organization._doc ? context.organization.id : context.organization.toString()
    }

    return Promise.resolve(serialized)
}

exports.deserializer = (claims, logger) => {
    let obj = {}

    if (claims.roleId) {
        obj.role = {
            id: claims.roleId
        }
    }

    if (claims.userId) {
        obj.user = {
            id: claims.userId
        }
    }

    if (claims.tenantId) {
        obj.tenant = {
            id: claims.tenantId
        }
    }

    if (claims.organizationId) {
        obj.organization = {
            id: claims.organizationId
        }
    }

    return create(claims, logger)
}

exports.create = create

