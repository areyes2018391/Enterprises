'use strict'

var express = require('express');
var enterpriseController = require('../controllers/enterprise.controller');
var api = express();

api.post('/saveEnterprise', enterpriseController.saveEnterprise);
api.get('/listEnterprises', enterpriseController.listEnterprises);
api.delete('/deleteEnterprise/:id', enterpriseController.deleteEnterprise);
api.put('/updateEnterprise/:id', enterpriseController.updateEnterprise);

//Employees URI's
api.put('/:id/addEmployee', enterpriseController.addEmployee);
api.put('/:idEn/removeEmployee/:idEm', enterpriseController.removeEmployee);
api.put('/:idEn/updateEmployee/:idEm', enterpriseController.updateEmployee);
api.get('/employeesTotal/:id', enterpriseController.employeesTotal);

module.exports = api;