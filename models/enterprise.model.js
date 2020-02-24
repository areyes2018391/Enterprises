'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enterpriseSchema = Schema({
    name: String,
    phone: Number,
    email: String,
    address: String,
    username: String,
    password: String,
    enterpriseProducts: String,

    employees: [{name: String,
        charge : String,
        department: String,
        phoneNumber: Number,
        email: String}],

    branches:[]
});

module.exports = mongoose.model('enterprise', enterpriseSchema);