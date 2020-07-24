//index, show, store, update, destroy
const Cliente = require('../models/Cliente');

module.exports = {
    async store(req,res){
        // const { Email, Senha } = req.body;      

        const cliente = await Cliente.findOne( req.body );
        
        if(!cliente){
            return res.status(400).json( { error : "Usário ou senha errados"} );
        }
        
        const token = await cliente.criarToken();
        
        // salva o token no cookie
        req.session.token = token;
        req.session.id = cliente._id.toString();
        req.session.save();

        return res.json(cliente);
    },

    async delete(req, res){
        const cliente = await Cliente.findById(req.session.id);
        if(!cliente){
            return res.status(400).json( { error : "Nenhum usuário logado!"} );
        }
        // Remove o token atual no db
        cliente.tokens = cliente.tokens.filter(token => token.token !== req.session.token)
        await cliente.save();
        
        // Remove o token no cookie
        req.session.token = null;
        req.session.id = null;
        req.session.save();

        res.redirect(303, "/");
        return res.send();
    }
}