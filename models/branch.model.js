'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var branchSchema = Schema({
    branchName: String,
        branchPhone: Number,
        branchAddress: String,
        
        branchProducts: [{
            name: String,
            quantity: Number
        }] 
})

module.exports = mongoose.model('branch', branchSchema);