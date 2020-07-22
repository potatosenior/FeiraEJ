const Produtos = require('../models/Produto');

module.exports = {
    
    async index(req,res){
        const Produto = await Produtos.find();
        return res.json(Produto);
    },
    
    async store(req,res){
        const {Imagem} = req.file;
        const {Nome, Tipo,Preco, Estoque} = req.body;
    
        const Produto =  await Produtos.create({Imagem, Nome, Tipo, Preco, Estoque});
        return res.json(Produto);
    },


    async update(req,res){
        const ID_Produto = req.params.Id_Produto;
        const {Nome, Tipo,Preco, Estoque} = req.body;

        const Produto = await Produtos.updateOne({_id: ID_Produto}, {Tipo,Estoque,Preco,Nome});
        return res.json(Produto);
    },

    async delete(req,res){
        const ID_Produto = req.params.Id_Produto;
        await Produtos.deleteOne({_id: ID_Produto});

        return res.json( { message : "Produto removido com sucesso "});
    }
}