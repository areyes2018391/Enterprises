'use strict'

var Employee = require('../models/employee.model');

function saveEmployee(req,res) {
    var params = req.body;
    var employee = new Employee();

    if(params.name &&
        params.email &&
        params.charge  &&
        params.phoneNumber &&
        params.department){

            Employee.findOne({name: params.name}, (err, employeeFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                }else if(employeeFind){
                    res.send({message: 'Nombre ya utilizado'});
                }else{
                    employee.name = params.name;
                    employee.email = params.email;
                    employee.charge  = params.charge ;
                    employee.phoneNumber = params.phoneNumber;
                    employee.department = params.department;

                    employee.save(employee, (err, employeeSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el servidor'});
                        }else if(employeeSaved){
                            res.send({employee: employeeSaved});
                        }else{
                            res.status(404).send({message: 'No se pudo agregar el empleado'})
                        }
                    })
                }
            })

        }else{
            res.send({message: 'Ingrese todos los datos'});
        }
}

function listEmployees(req, res) {
    Employee.find({}, (err, employees)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(employees){
            res.send({employees: employees});
        }else{
            res.status(404).send({message: 'No se encontró ningun empleado'})
        }
    })
}

function deleteEmployee(req, res) {
    var employeeId = req.params.id;

    Employee.findByIdAndDelete(employeeId, (err, employeeDeleted)=>{
        if(err){
            res.stautus(500).send({message: 'Error en el servidor'});
        }else if(employeeDeleted){
            res.send({message: 'Empleado eliminado'});
        }else{
            res.status(404).send({message: 'No se pudo eliminar al empleado'});
        }
    })
}

function updateEmployee(req, res) {
    var employeeId = req.params.id;
    var update = req.body;

    Employee.findByIdAndUpdate(employeeId, update, {new: true}, (err, employeeUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(employeeUpdated){
            res.send({employee: employeeUpdated});
        }else{
            res.status(404).send({message: 'No se pudo actualizar el empleado'});
        }
    })
}

module.exports = {
    saveEmployee,
    listEmployees,
    deleteEmployee,
    updateEmployee
}