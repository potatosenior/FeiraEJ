const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');
const Cesta = require('../models/Cesta');
const Cliente = require('../models/Cliente');

module.exports = {
    async index(req,res){
        const Id_Cliente = req.headers.id_cliente;
        const carrinho = await Carrinho.find({Id_Cliente:Id_Cliente});
        return res.json(carrinho);
    },   

    async remove(req,res){
        const cliente = await Cliente.findById(req.session.id);
        let carrinho;

        if (cliente) {
            carrinho = await Carrinho.findById(cliente.Carrinho);
        } else {
            carrinho = Carrinho(req.session.carrinho);
        }
        if (!carrinho) return res.status(400).send();
        let qntd = carrinho.Produtos.length;
        
        for (let idx = 0; idx < qntd; idx++) {
            const item = carrinho.Produtos[idx];
            let produto;

            if (item.Tipo !== "cesta") {
                produto = await Produto.findById(item.Id);
            } else {
                produto = await Cesta.findById(item.Id);
            }
            if (!produto) continue;
            // subtrair do estoque
            produto.Estoque -= item.Quantidade;
            await produto.save();
        }
        carrinho.Produtos = [];
        carrinho.calculate_subtotal();
        
        if (cliente) {
            carrinho.save();
        } else {
            req.session.save();
        }
        res.status(200).send();
    }
}