const Carrinho = require('../models/Carrinho');
const Cliente = require('../models/Cliente');
const Produto = require('../models/Produto');
const Cesta = require('../models/Cesta');
const mongoose = require("mongoose");

async function updateCompra(Id_Cliente,Id_Produto ,Quantidade,Subtotal){
    await Carrinho.updateOne({Id_Cliente:Id_Cliente, Id_Produto:Id_Produto}, {Id_Cliente,Id_Produto ,Quantidade,Subtotal});
    return("atualizado");
}

module.exports = {
    async index(req, res){
        const cliente = await Cliente.findById(req.session.id);
        let carrinho;

        if (cliente) {
            carrinho = await Carrinho.findById(cliente.Carrinho);
        } else {
            carrinho = Carrinho(req.session.carrinho);
        }
        if (!carrinho) return [];

        carrinho.Produtos = carrinho.Produtos.filter( async item => {
            let exists;
            if (item.Tipo !== "cesta") {
                exists = await Produto.findById(item.Id);
            } else {
                exists = await Cesta.findById(item.Id);
            }

            if (exists) {
                // verifica s o produto existe e ainda há estoque pra quantidade desejada
                if (item.Quantidade > exists.Estoque) return false;
                item.Estoque = exists.Estoque;
            } else return false;
        });
        carrinho.calculate_subtotal();

        if (cliente) {
            // salva no db se logado
            carrinho.save();
        }

        return carrinho;
    },
    
    async store(req,res){
        const { Quantidade, Tipo } = req.body;
        const Id = req.params.id;
        const cliente = await Cliente.findById(req.session.id);
        let carrinho;
        let item;

        if (req.session.carrinho) {
            carrinho = Carrinho(req.session.carrinho);
        } else if (cliente) {
            if (cliente.Carrinho) {
                // verifica se o cliente tem carrinho
                // se tiver, inicial ele como obj Carrinho
                carrinho = await Carrinho.findById(cliente.Carrinho);
            }
        }
        

        if (Tipo === "produto") {
            item = await Produto.findById(Id);
        } else {
            item = await Cesta.findById(Id);
        }

        if (!item) {
            // item nao existe no banco de dados
            return res.status(404).send({error: "Item não encontrado!"});
        }

        if (item.Estoque < Quantidade) {
            // Não tem estoque suficiente pra quantidade desejada
            return res.status(400).send({error: "Não há estoque suficiente para quantidade desejada!"});
        }

        if (!carrinho) {
            // nao tem carrinho
            console.log("Nao tem carrinho, criar um!")
            carrinho = new Carrinho();
            if (cliente) {
                Carrinho.Id_Cliente = cliente._id;
                cliente.Carrinho = carrinho._id;
                console.log("Cria e salva o carrinho no cliente ", cliente.Carrinho);
                await cliente.save();
            }
        } 

        await carrinho.add_item(Id, Quantidade, Tipo, item.Nome, item.Estoque, item.Preco, item.ImagemUrl);
        await carrinho.calculate_subtotal();

        if (cliente) {
            // se tiver logado, salva o carrinho no banco de dados
            console.log("salva o carrinho")
            carrinho.save();
        } else {
            req.session.carrinho = carrinho;
            req.session.save();
        }
        return res.send();
    },

    async remove(req,res){
        const { id } = req.params;
        const cliente = await Cliente.findById(req.session.id);
        let carrinho;
        

        if (req.session.carrinho) {
            carrinho = Carrinho(req.session.carrinho);
        } else if (cliente) {
            if (cliente.Carrinho) {
                // verifica se o cliente tem carrinho
                // se tiver, inicial ele como obj Carrinho
                carrinho = await Carrinho.findById(cliente.Carrinho);
            } else 
                // nao existe carrinho
                return res.status(400).send({error: "Esse produto não está no carrinho!"});
        }

        await carrinho.remove_item(id);
        await carrinho.calculate_subtotal();
        await carrinho.save();

        return res.send();
    },

    async update(req,res, next){
        const { id } = req.params;
        const { qntd } = req.body;
        const cliente = await Cliente.findById(req.session.id);
        let carrinho;
        
        if (req.session.carrinho) {
            carrinho = Carrinho(req.session.carrinho);
        } else if (cliente) {
            if (cliente.Carrinho) {
                // verifica se o cliente tem carrinho
                // se tiver, inicial ele como obj Carrinho
                carrinho = await Carrinho.findById(cliente.Carrinho);
            } else 
                // nao existe carrinho
                return res.status(400).send({error: "Esse produto não está no carrinho!"});
        }
        await carrinho.update_item(id, qntd);
        await carrinho.calculate_subtotal();
        await carrinho.save();
        return res.send();
    }
}