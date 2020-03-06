'use strict'

var Enterprise = require('../models/enterprise.model');
var Employee = require('../models/employee.model');
var Branch = require('../models/branch.model');
var Product = require('../models/product.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
 
function saveEnterprise(req, res ){
    var params = req.body;
    var enterprise = new Enterprise();

    if(params.name && 
        params.email &&
        params.address &&
        params.phone){
            Enterprise.findOne({$or:[{username: params.username},{email: params.email}, {phoneNumber: params.phone}]}, (err, enterpriseFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                }else if (enterpriseFind){
                    res.send({message: 'Datos de la empresa ya usados'});
                }else{
                   enterprise.name =params.name;
                   enterprise.phone = params.phone;
                   enterprise.email = params.email;
                   enterprise.address = params.address;
                   enterprise.password = params.password;
                   enterprise.username = params.username;

                   bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                       if(err){
                        res.status(500).send({message: 'Error de encriptación'});
                       }else{
                        
                        enterprise.password = hashPassword;
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

if(enterpriseId != req.enterprise.sub){
    res.status(403).send({message: 'Error de permisos, usuario no logueado'});
}else{
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
}

function updateEnterprise (req, res){
    var enterpriseId = req.params.id;
    var update = req.body;

    Enterprise.findOne({$or:[{username: update.username},{email: update.email}, {phoneNumber: update.phone}]},  (err, enterpriseFind)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(enterpriseFind){
            res.status(418).send({message: 'La empresa ya existe'});

        }else{
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
    })

}

function addEmployee(req,res){
    var enterpriseId = req.params.id;
    var params = req.body;
    var employee = new Employee();

    if(params.name && params.email){
        Enterprise.findById(enterpriseId, (err, enterpriseFind)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});

            }else if(enterpriseFind){

               Employee.findOne({name: params.name}, (err, employeeFind)=>{
                   if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                   }else if(employeeFind){
                    res.send({message: 'Empleado ya existente'});
                   }else{
                    employee.name = params.name;
                    employee.email = params.email;
                    employee.charge  = params.charge ;
                    employee.phoneNumber = params.phoneNumber;
                    employee.department = params.department;
    
                    employee.save((err, employeesSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el servidor'});
                        }else if(employeesSaved){
                            Enterprise.findByIdAndUpdate(enterpriseId, {$push: {employees: employee}}, {new: true}, (err, enterpriseUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'Error en el servidor'});
                                }else if(enterpriseUpdated){
                                    res.send({enterprise: enterpriseUpdated});
                                }else{
                                    res.status(418).send({message: 'Error al actualizar la empresa'});
                                }
                            })
                        }else{
                            res.status(418).send({message: 'No se pudo agregar el empleado'})
                        }
                    })
                   }
               })
            }else{
                res.status(418).send({message: 'Empresa no encontrada'});
            }
        })
    }else{
        res.send({message: 'Faltan datos por ingresar'});
    }
}



function removeEmployee(req, res){
    let  enterpriseId = req.params.idEn;
    let employeeId = req.params.idEm;

    Enterprise.findOneAndUpdate({_id:enterpriseId, "employees._id":employeeId}, {$pull:{employees:{_id:employeeId}}}, {new: true}, (err, employeeRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(employeeRemoved){
            Employee.findByIdAndDelete(employeeId, (err, employeeDeleted)=>{
                if(err){    
                    res.status(500).send({message: 'Error en el servidor'});
                }else if(employeeDeleted){
                    res.send({message: 'Empleado eliminado'})
                }else{
                    res.status(404).send({message: 'No se pudo eliminar el empleado'});
                }
            })
        }else{
            res.status(404).send({message: 'No se pudo eliminar el empleado de la empresa'});
            console.log(err);
        }
    })
}

function updateEmployee(req, res){
    const enterpriseId = req.params.idEn;
    var employeeId = req.params.idEm;
    var params = req.body;

    Enterprise.findById(enterpriseId, (err, enterpriseOk)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(enterpriseOk){
           Employee.findByIdAndUpdate(employeeId, params,(err, employeeUpdated)=>{
               if(err){
                res.status(500).status({message: 'Error en el servidor'});
               }else if(employeeUpdated){
                Enterprise.findOneAndUpdate({_id:enterpriseId, "employees._id":employeeId}, 
                {"employees.$.name": params.name,
                "employees.$.email": params.email,
                "employees.$.phoneNumber": params.phoneNumber,
                "employees.$.charge": params.charge,
                "employees.$.department": params.department },{new:true}, (err, enterpriseUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error en el servidor'});
                    }else if(enterpriseUpdated){
                        res.send({enterprise: enterpriseUpdated});
                    }else{
                        res.status(418).send({message: 'No se pudo actualizar la empresa'});
                    }
                }
                );
               }else{
                res.status(418).send({message: 'No se pudo actualizar el empleado'});
               }
           })
        }else{
            res.status(418).send({message: 'No se encontró la empresa'});
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

function login (req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            Enterprise.findOne({$or:[{username: params.username},{email: params.email}]} , (err, enterpriseFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});

                }else if(enterpriseFind){
                    bcrypt.compare(params.password, enterpriseFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: ' error al comparar las contraseñas'});

                        }else if(checkPassword){
                            if(params.gettoken){
                               res.send({token: jwt.createToken(enterpriseFind)});
                            }
                            else{
                                res.send({enterprise: enterpriseFind});
                            }

                        }else{
                            res.status(401).send({message: 'Contraseña incorrecta'});
                        }
                    })
                }else{
                    res.send({message: 'No se encontró la empresa'})
                }
            })
        }else{
            res.send({message: 'Por favor ingrese la contraseña'})
        }
    }else{
        res.send({message:'Ingrese el nombre de usuario o correo'});  
    }

}

function pruebaMiddleWare(req, res){
    var enterprise = req.enterprise;
    res.send({message: 'Middleware funcionando', req: enterprise})
}

function addBranch(req, res){
    var enterpriseId = req.params.id;
    var params = req.body;
    var branch = Branch();

    if(params.branchName && params.branchPhone && params.branchAddress){
        Enterprise.findById(enterpriseId, (err, enterpriseFind)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});

            }else if(enterpriseFind){

               Branch.findOne({branchName: params.branchName}, (err, branchFind)=>{
                   if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                   }else if(branchFind){
                    res.send({message: 'Sucursal ya existente'});
                   }else{
                    branch.branchName = params.branchName;
                    branch.branchPhone = params.branchPhone;
                    branch.branchAddress = params.branchAddress;
    
                    branch.save((err, branchSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el servidor'});
                        }else if(branchSaved){
                            Enterprise.findByIdAndUpdate(enterpriseId, {$push: {branches: branch}}, {new: true}, (err, enterpriseUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'Error en el servidor'});
                                }else if(enterpriseUpdated){
                                    res.send({enterprise: enterpriseUpdated});
                                }else{
                                    res.status(418).send({message: 'Error al actualizar la empresa'});
                                }
                            })
                        }else{
                            res.status(418).send({message: 'No se pudo agregar la sucursal'})
                        }
                    })
                   }
               })
            }else{
                res.status(418).send({message: 'Empresa no encontrada'});
            }
        })
    }else{
        res.send({message: 'Faltan datos por ingresar'});
    }    
}

function removeBranch(req, res){
    let  enterpriseId = req.params.idEn;
    let branchId = req.params.idBr;

    Enterprise.findOneAndUpdate({_id:enterpriseId, "branches._id":branchId}, {$pull:{branches:{_id:branchId}}}, {new: true}, (err, branchRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(branchRemoved){
            Branch.findByIdAndDelete(branchId, (err, branchDeleted)=>{
                if(err){    
                    res.status(500).send({message: 'Error en el servidor'});
                }else if(branchDeleted){
                    res.send({message: 'Sucursal eliminada'})
                }else{
                    res.status(404).send({message: 'No se pudo eliminar la sucursal'});
                }
            })
        }else{
            res.status(404).send({message: 'No se pudo eliminar la sucursal de la empresa'});
            console.log(err);
        }
    })
}

function updateBranch(req, res){
    const enterpriseId = req.params.idEn;
    var branchId = req.params.idBr;
    var params = req.body;

    Enterprise.findById(enterpriseId, (err, enterpriseOk)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(enterpriseOk){
           Branch.findByIdAndUpdate(branchId, params,(err, branchUpdated)=>{
               if(err){
                res.status(500).status({message: 'Error en el servidor'});
               }else if(branchUpdated){
                Enterprise.findOneAndUpdate({_id:enterpriseId, "branches._id":branchId}, 
                {"branches.$.branchName": params.branchName,
                "branches.$.branchPhone": params.branchPhone,
                "branches.$.branchAddress": params.branchAddress },{new:true}, (err, enterpriseUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error en el servidor'});
                    }else if(enterpriseUpdated){
                        res.send({enterprise: enterpriseUpdated});
                    }else{
                        res.status(418).send({message: 'No se pudo actualizar la empresa'});
                    }
                }
                );
               }else{
                res.status(418).send({message: 'No se pudo actualizar la sucursal'});
               }
           })
        }else{
            res.status(418).send({message: 'No se encontró la empresa'});
        }
    });
}

function addProduct(req, res){
    var enterpriseId = req.params.idEn;
    var branchId = req.params.idBr;
    var params = req.body;
    var product = Product();
    
    if(params.name && params.quantity){
        Enterprise.findById(enterpriseId, (err, enterpriseFind)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});

            }else if(enterpriseFind){

               Product.findOne({name: params.name}, (err, productFind)=>{
                   if(err){
                    res.status(500).send({message: 'Error en el servidor'});
                   }else if(productFind){
                    res.send({message: 'Producto ya existente'});
                   }else{
                    product.name = params.name;
                    product.quantity = params.quantity;
    
                    product.save((err, productSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el servidor'});
                        }else if(productSaved){
                            Enterprise.findByIdAndUpdate(enterpriseId, {$push: {products: product}}, {new: true}, (err, enterpriseUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'Error en el servidor'});
                                }else if(enterpriseUpdated){
                                    Enterprise.findByIdAndUpdate(enterpriseId, {$push: {branches: {products: product}}}, {new: true}, (err, branchUpdated)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error en el servidor'});
                                            console.log(err);
                                        }else if(branchUpdated){
                                            res.send({branches: branchUpdated});
                                        }else{
                                            res.send({message: 'No se pudo actualizar la sucursal'});
                                        }
                                    })
                                }else{
                                    res.status(418).send({message: 'Error al actualizar la empresa'});
                                }
                            })
                        }else{
                            res.status(418).send({message: 'No se pudo agregar el producto'});
                        }
                    })
                   }
               })
            }else{
                res.status(418).send({message: 'Empresa no encontrada'});
            }
        })
    }else{
        res.send({message: 'Faltan datos por ingresar'});
    }    

} 



module.exports ={
    saveEnterprise,
    listEnterprises,
    deleteEnterprise,
    updateEnterprise,
    addEmployee,
    updateEmployee,
    removeEmployee,
    employeesTotal,
    login,
    pruebaMiddleWare, 
    addBranch,
    removeBranch,
    updateBranch,
    addProduct
}
