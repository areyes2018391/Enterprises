'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_super_hiper_mega_secreta';

exports.createToken = (enterprise)=>{
    var payload = {
     sub: enterprise._id,
     name: enterprise.name,
     username: enterprise.username,
     iat: moment().unix(),
     exp: moment().add(60, "minutes").unix()
    }

    return jwt.encode(payload, key);
}
