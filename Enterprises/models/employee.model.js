'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = Schema ({
    name: String,
    charge : String,
    department: String,
    phoneNumber: Number,
    email: String
});

module.exports = mongoose.model('employee', employeeSchema);