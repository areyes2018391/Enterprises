'use strict'

var Enterprise = require('../models/enterprise.model');
var Employee = require('../models/employee.model');
 
function saveEnterprise(req, res ){
    var params = req.body;
    var enterprise = new Enterprise();

    if(params.name && 
        params.email &&
        params.address &&
        params.phone){
            Enterprise.findOne({name: params.name}, (err, enterpriseFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                    console.log(err);
                }else if (enterpriseFind){
                    res.send({message: 'Nombre de empresa ya usado'});
                }else{
                   enterprise.name =params.name;
                   enterprise.phone = params.phone;
                   enterprise.email = params.email;
                   enterprise.address = params.address;

                   enterprise.save(enterprise, (err, enterpriseSaved)=>{
                       if(err){
                        res.status(500).send({message: 'Error en el servidor'});
                       }else if(enterpriseSaved){
                        res.send({enterprise: enterpriseSaved});
                       }else{
                        res.send({message: 'No se pudo guardar la empresa'});
                       }
                   })
                }
            })
        }else{
            res.send({message: 'Ingrese todos los datos'});
        }
}

function listEnterprises(req, res){
    Enterprise.find({}, (err, enterprises)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(enterprises){
            res.send({enterprises: enterprises});
        }else{
            res.status(404).send({message: 'No se encontró nada'});
        }
    })
}

function deleteEnterprise(req, res){
    var enterpriseId = req.params.id;

    Enterprise.findByIdAndDelete(enterpriseId, (err, enterpriseDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(enterpriseDeleted){
            res.send({message: 'Empresa eliminada correctamente'});
        }else{
            res.status(404).send({message: 'No se pudo encontrar y eliminar la empresa'});
        }
    })
}

function updateEnterprise (req, res){
    var enterpriseId = req.params.id;
    var update = req.body;

    Enterprise.findByIdAndUpdate(enterpriseId, update, {new: true}, (err, enterpriseUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(enterpriseUpdated){
            res.send({enterprise: enterpriseUpdated});
        }else{
            res.status(404).send({message: 'No se pudo actualizar el registro'});
        }
    })
}

function addEmployee(req,res){
    var idEmpresa = req.params.idEmpresa;
    var params = req.body;
    var employee = new Employee();

	Enterprise.findById(idEmpresa,(err,enterpriseFind)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(enterpriseFind){

            if(params.name && params.email &&
                params.charge && params.phoneNumber
                 && params.department){
         
                     Employee.findOne({name:params.name}, (err,employeeFind)=>{
                                          if(err){
                                              res.status(500).send({message:'Error en el servidor'});
                                          }else if(employeeFind){
                                              res.send({message:'Empleado ya agregado.'});
                                          }else{
                                            employee.name = params.name;
                                            employee.charge = params.charge;
                                            employee.phoneNumber = params.phoneNumber;
                                            employee.email = params.email;
                                            employee.department = params.department
         
                                            employee.save((err,employeeSaved)=>{
                                                  if(err){
                                                      res.status(500).send({message:'Error'});

                                                  }else if(employeeSaved){
                                                        Enterprise.findByIdAndUpdate(idEmpresa,{$push:{employees:employee}},{new:true}, (err,employeeSaved)=>{
                                                            if(err){
                                                                res.status(500).send({message:'Error en el servidor'});
                                                            }else if(employeeSaved){
                                                                res.send({message:'Empleado agregado'});
                                                                res.send({employee: employeeSaved});
                                                            }else{
                                                                res.status(200).send({message: 'Error al agregar empleado.'});
                                                            }
                                                        });
                                                        
                                                  }else{
                                                      res.status(200).send({message:'No se pudo agregar el empleado.'});
                                                  }
                                              });
                                              
                                          }
                                    });
         
            }else{
                res.send({message:'faltan datos'});
            }
        }else{
            res.send({message:'id de empresa incorrecto.'});
        }
    });

}



function removeEmployee(req, res){
    const enterpriseId = req.params.idEn;
    var employeeId = req.params.idEm;
    var employee = Employee();

    Enterprise.findById(enterpriseId,(err, enterpriseFind)=>{ 
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(enterpriseFind){

            Employee.findByIdAndDelete(employeeId,(err, employeeDeleted)=>{
                
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});
        
                }else if(employeeDeleted){
        
                    Enterprise.findOneAndUpdate({_id:enterpriseId,"employees._id":employeeId},{$pull:{employees:{employee}}}, {new:true}, (err, employeeRemoved)=>{

                if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                }else if(employeeRemoved){
                    res.send({message: 'Empleado eliminado'});
                }else{
                    res.status(418).send({message: 'Empleado no eliminado',err});
                }
            });
                }else{
                    res.send({message: 'No se pudo eliminar el empleado', err})
                } 
            })
        
        }else{
            res.send({message: 'No se pudo encontrar la empresa'})
        }
    })
}

function updateEmployee(req, res){
    const enterpriseId = req.params.idEn;
    var employeeId = req.params.idEm;
    var params = req.body;

    Enterprise.findById(enterpriseId, (err, enterpriseOk)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(enterpriseOk){
            Enterprise.findOneAndUpdate({enterpriseId, "employee._id":employeeId}, 
            {"employee.$.name": params.name,
            "employee.$.email": params.email,
            "employee.$.phoneNumber": params.phoneNumber,
            "employee.$.charge": params.charge,
            "employee.$.department": params.departament },{new:true}, (err, enterpriseUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(enterpriseUpdated){
                    res.send({enterprise: enterpriseUpdated});
                }else{
                    res.status(418).send({message: 'No se pudo actualizar el empleado'});
                }
            }
            );
        }else{
            res.status(418).send({message: 'No existe el empleado'});
        }
    });
}

function employeesTotal(req, res){
    const enterpriseId = req.params.id;

    Enterprise.findById(enterpriseId, (err, employeesT)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(employeesT){
            res.send({Enterprise: employeesT.name, Employees: employeesT.employees.length});
        }else{
            res.status(404).send({message: 'No se encontró ningun empleado'})
        }
    })
}
module.exports ={
    saveEnterprise,
    listEnterprises,
    deleteEnterprise,
    updateEnterprise,
    addEmployee,
    updateEmployee,
    removeEmployee,
    employeesTotal
}
