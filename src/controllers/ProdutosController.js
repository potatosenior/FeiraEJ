const Produtos = require('../models/Produto');

module.exports = {
    async store(req,res){
        const {Imagem, Nome, Tipo,Preco, Estoque} = req.body;
    
        const Produto =  await Produtos.create({Imagem, Nome, Tipo, Preco, Estoque});
        return res.json(Produto);
    },

    async index(req,res){
        const Produto = await Produtos.find();
        return res.json(Produto);
    },

    async delete(req,res){
        const _id = req.body;
        await Produtos.deleteOne({_id: _id});

        return res.json( { message : "Produto removido com sucesso "});
    }
}