'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String, 
    quantity: Number
})

module.exports = mongoose.model('product', productSchema);