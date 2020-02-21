'use strict'

var express = require('express');
var enterpriseController = require('../controllers/enterprise.controller');
var api = express();

api.post('/saveEnterprise', enterpriseController.saveEnterprise);
api.get('/listEnterprises', enterpriseController.listEnterprises);
api.delete('/deleteEnterprise/:id', enterpriseController.deleteEnterprise);
api.put('/updateEnterprise/:id', enterpriseController.updateEnterprise);
api.post('/addEmployee/:idEmpresa', enterpriseController.addEmployee);
api.put('/updateEmployee/:idEn/:idEm', enterpriseController.updateEmployee);
api.delete('/removeEmployee/:idEn/:idEm', enterpriseController.removeEmployee);
api.get('/employeesTotal/:id', enterpriseController.employeesTotal);

module.exports = api;