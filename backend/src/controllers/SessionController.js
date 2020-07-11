//index, show, store, update, destroy
const Cliente = require('../models/Cliente');
const { findOne } = require('../models/Cliente');


module.exports = {
    async store(req,res){
        const {Nome, CPF, Email, Senha, Endereco, Celular } = req.body;      
        
        let cliente = await Cliente.findOne( { CPF });

        if(!cliente){
            cliente = await Cliente.create({ Nome, CPF, Email, Senha, Endereco, Celular });
        }
        return res.json(cliente);
    }
}