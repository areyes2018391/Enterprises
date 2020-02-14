'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enterpriseSchema = Schema({
    name: String,
    phone: Number,
    email: String,
    address: String,
    employees: []
});

module.exports =mongoose.model('enterprise', enterpriseSchema);