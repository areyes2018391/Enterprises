'use strict'

var express = require('express');
var enterpriseController = require('../controllers/enterprise.controller');
var api = express();
var middlewareAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');


api.post('/saveEnterprise', enterpriseController.saveEnterprise);
api.get('/listEnterprises', middlewareAuth.ensureAuth, enterpriseController.listEnterprises);
api.delete('/deleteEnterprise/:id', middlewareAuth.ensureAuth, enterpriseController.deleteEnterprise);
api.put('/updateEnterprise/:id', middlewareAuth.ensureAuth, enterpriseController.updateEnterprise);

//Employees URI's
api.put('/:id/addEmployee', middlewareAuth.ensureAuth, enterpriseController.addEmployee);
api.put('/:idEn/removeEmployee/:idEm', middlewareAuth.ensureAuth, enterpriseController.removeEmployee);
api.put('/:idEn/updateEmployee/:idEm', middlewareAuth.ensureAuth, enterpriseController.updateEmployee);
api.get('/employeesTotal/:id', middlewareAuth.ensureAuth, enterpriseController.employeesTotal);

// Login and etc
api.get('/login', enterpriseController.login);
api.get('/pruebaMiddleWare', middlewareAuth.ensureAuth,  enterpriseController.pruebaMiddleWare);

module.exports = api;