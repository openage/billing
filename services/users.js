'use strict'
const db = require('../models')
const tenants = require('./tenants')
const organizations = require('./organizations')
const directory = require('../providers/directory')

const set = (model, entity, context) => {
    if (model.phone) {
        entity.phone = model.phone
    }

    if (model.email) {
        entity.email = model.email
    }

    if (model.profile) {
        entity.profile = entity.profile || {}
        if (model.profile.firstName) {
            entity.profile.firstName = model.profile.firstName
        }
        if (model.profile.lastName) {
            entity.profile.lastName = model.profile.lastName
        }
        if (model.profile.dob) {
            entity.profile.dob = model.profile.dob
        }
        if (model.profile.gender) {
            entity.profile.gender = model.profile.gender
        }
    }

    if (model.bankDetails) {
        entity.bankDetails = entity.bankDetails || {}
        if (model.bankDetails.name) {
            entity.bankDetails.name = model.bankDetails.name
        }
        if (model.bankDetails.account) {
            entity.bankDetails.account = model.bankDetails.account
        }
        if (model.bankDetails.branch) {
            entity.bankDetails.branch = model.bankDetails.branch
        }
        if (model.bankDetails.ifscCode) {
            entity.bankDetails.ifscCode = model.bankDetails.ifscCode
        }
    }

    if (model.pan) {
        entity.pan = model.pan
    }

    if (model.aadhar) {
        entity.aadhar = model.aadhar
    }
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/users:create')

    const user = await new db.user(model).save()

    log.end()
    return user
}

exports.update = async (model, id, context) => {
    let log = context.logger.start('services/users:update')

    let user = await db.user.findById(id)

    set(model, user, context)

    log.end()
    return user.save()
}

const createWithRoleModel = async (role, context) => {
    let log = context.logger.start("createWithRoleModel")

    if (!role) {
        throw new Error('role required!')
    }

    let user = await db.user.findOne({ 'role.id': role.id }).populate('organization tenant')

    if (!user) {
        user = await new db.user({
            status: 'active',
            role: {
                id: role.id,
                key: role.key,
                code: role.code,
                permissions: role.permissions
            },
            tenant: context.tenant
        }).save()
    }

    // update attributes

    user.profile = user.profile || {}
    user.profile.firstName = role.user.profile ? role.user.profile.firstName : user.profile.firstName
    user.profile.lastName = role.user.profile ? role.user.profile.lastName : user.profile.lastName
    user.profile.gender = role.user.profile ? role.user.profile.gender : user.profile.gender
    user.profile.dob = role.user.profile ? role.user.profile.dob : user.profile.dob
    user.profile.pic = role.user.profile ? role.user.profile.pic : user.profile.pic

    if (role.employee && role.employee.address) {
        user.address = role.employee.address
    }

    if (role.organization && role.organization.id) {
        user.organization = context.organization
    }

    await user.save()
    log.end()
    return user
}

const get = async (query, context) => {
    context.logger.debug('services/users:get')

    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.user.findById(query).populate('organization tenant')
        }
        return db.user.findOne({
            code: query,
            organization: context.organization,
            tenant: context.tenant
        }).populate('organization tenant')
    }
    if (query.id) {
        return db.user.findById(query.id).populate('organization tenant')
    }

    if (query.code) {
        return db.user.findOne({
            'role.code': query.code,
            organization: context.organization,
            tenant: context.tenant
        }).populate('organization tenant')
    }

    if (query.role && query.role.key) {
        return db.user.findOne({
            'role.key': query.role.key
        }).populate('organization tenant')
    }

    if (query.role && query.role.id) {
        return db.user.findOne({
            'role.id': query.role.id
        }).populate('organization tenant')
    }

    return null
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/users:search')

    const users = await db.user.find(query)

    log.end()
    return users
}

exports.getFromDirectory = async (roleKey, logger) => {
    const log = logger.start('services/users:getFromDirectory')
    let user = await db.user.findOne({ 'role.key': roleKey }).populate('organization tenant')
    if (user) {
        return user
    }

    const role = await directory.getRole(roleKey)

    if (!role) {
        log.error(`could not find any role with key ${roleKey}`)
        return null
    }

    let context = { logger: logger }

    context.tenant = await tenants.getByCode(role.tenant.code, context) ||
        await tenants.create(role.tenant, context)

    if (role.organization) {
        context.organization = await organizations.getByCode(role.organization.code, context) ||
            await organizations.create(role.organization, context)
    }

    user = await db.user.findOne({ 'role.id': role.id }).populate('organization tenant')

    if (!user) {
        user = await new db.user({
            status: 'active',
            organization: context.organization,
            tenant: context.tenant
        }).save()
    }

    user.role = user.role || {}
    user.role.id = `${role.id}`
    user.role.code = role.code
    user.role.key = role.key
    user.role.permissions = role.permissions || []

    // update attributes

    user.profile = user.profile || {}
    user.profile.firstName = role.user.profile ? role.user.profile.firstName : user.profile.firstName
    user.profile.lastName = role.user.profile ? role.user.profile.lastName : user.profile.lastName
    user.profile.gender = role.user.profile ? role.user.profile.gender : user.profile.gender
    user.profile.dob = role.user.profile ? role.user.profile.dob : user.profile.dob
    user.profile.pic = role.user.profile ? role.user.profile.pic : user.profile.pic

    if (role.employee && role.employee.address) {
        user.address = role.employee.address
    }

    await user.save()
    log.end()
    return user
}

exports.getOrCreate = async (data, context) => {
    let log = context.logger.start('services/users:getOrCreate')

    let user = await get(data, context)

    if (!user) {
        let role = await directory.getRole(context.role.key, data.role.id)

        context.tenant = await tenants.getByCode(role.tenant.code, context) ||
            await tenants.create(role.tenant, context)

        if (role.organization) {
            context.organization = await organizations.getByCode(role.organization.code, context) ||
                await organizations.create(role.organization, context)
        }

        user = await createWithRoleModel(role, context)
    }

    log.end()
    return user
}

exports.getById = (id, context) => {
    return db.user.findById(id)
}
