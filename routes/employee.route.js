'use strict'

var express = require('express');
var employeeController = require('../controllers/employee.controller');
var api = express();

api.post('/saveEmployee', employeeController.saveEmployee);
api.get('/listEmployees', employeeController.listEmployees);
api.delete('/deleteEmployee/:id', employeeController.deleteEmployee);
api.put('/updateEmployee/:id', employeeController.updateEmployee)
api.get('/findEmployee',employeeController.findEmployee);
api.get('/employeesTotal/:id', employeeController.employeesTotal);

module.exports = api;