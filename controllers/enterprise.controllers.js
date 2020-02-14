'use strict'

var Enterprise = require('../models/enterprise.model');
 
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

    
}


module.exports ={
    saveEnterprise,
    listEnterprises,
    deleteEnterprise,
    updateEnterprise
}