exports.toModel = (entity) => {
    let model = {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        config: entity.config,
        bankDetails: {}
    }

    if (entity.bankDetails) {
        model.bankDetails = {
            name: entity.bankDetails.name,
            account: entity.bankDetails.account,
            branch: entity.bankDetails.branch,
            ifscCode: entity.bankDetails.ifscCode
        }
    }

    return model
}
