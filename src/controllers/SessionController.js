//index, show, store, update, destroy
const Cliente = require('../models/Cliente');

module.exports = {
    async store(req,res){
        const {Email, Senha } = req.body;      

        let cliente = await Cliente.findOne( { Email, Senha } );

        if(!cliente){
            return res.status(400).json( { error : "Usário ou senha errados"} );
        }

        return res.json(cliente);
    }
}