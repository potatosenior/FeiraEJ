//index, show, store, update, destroy
const Cliente = require('../models/Cliente');
const Carrinho = require('../models/Carrinho');

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
        req.session.id = cliente._id;
        req.session.save();

        // se o usuario n tiver carrinho e tiver algum carrinho salvo nos cookies
        // o carrinho do usuario recebe os produtos do carrinho do cookie
        if (!cliente.Carrinho && req.session.carrinho) {
            const carrinho = new Carrinho(req.session.carrinho);

            carrinho.Id_Cliente = cliente._id;
            cliente.Carrinho = carrinho._id;
            await carrinho.save();
            await cliente.save();
        }

        return res.send();
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
        req.session.carrinho = null;
        req.session.save();

        res.redirect(303, "/");
        return res.send();
    }
}