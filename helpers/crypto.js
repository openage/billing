'use strict';

const crypto = require('crypto')

exports.hashingLogic = (txt) => {
    var sha512 = crypto.createHash('sha512')
    sha512.update(txt, 'utf8')
    return sha512.digest('hex')
}
