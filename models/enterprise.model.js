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

    products: [{
        name: String,
        quantity: Number,
    }],

    employees: [{name: String,
        charge : String,
        department: String,
        phoneNumber: Number,
        email: String}],

    branches:[{
        branchName: String,
        branchPhone: Number,
        branchAddress: String,

        products:[
            {name: String,
                quantity: Number
            }
        ]
        
         
    }]


});

module.exports = mongoose.model('enterprise', enterpriseSchema);