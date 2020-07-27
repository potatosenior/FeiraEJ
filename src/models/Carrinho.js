const mongoose = require('mongoose');
const Produto = require('../models/Produto');
const Cesta = require('../models/Cesta');

const CarrinhoSchema = new mongoose.Schema({
    Id_Cliente: mongoose.Schema.Types.ObjectId,         
    Produtos: [{
        Id: mongoose.Schema.Types.ObjectId,
        Nome: String,
        Quantidade: Number,
        Estoque: Number,
        Tipo: String,
        Preco: Number,
        ImagemUrl: String,
        Cesta: Boolean,
        Produtos: Array
    }],
    Subtotal: Number
});

CarrinhoSchema.methods.calculate_subtotal = async function() {
    const carrinho = this;
    const produtos = carrinho.Produtos;
    let subtotal = 0;
    
    if (produtos) {
        for (let idx = 0; idx < produtos.length; idx++) {
            const produto = produtos[idx];
            let item;
            
            
            if (produto.Tipo === "produto") {
                item = await Produto.findById(produto.Id);
            } else {
                item = await Cesta.findById(produto.Id);
            }

            if (item) {
                if (produto.Tipo === "produto") {
                    // transforma de gramas pra kilo e calcula o valor
                    subtotal += item.Preco * Number((produto.Quantidade / 1000));
                } else {
                    subtotal += item.Preco * produto.Quantidade;
                }
            }
        }
    }
    // formata pra somente 2 casas decimais
    carrinho.Subtotal = Number( subtotal.toFixed(2) );
}

CarrinhoSchema.methods.add_item = async function(id, qntd, type, name, stock, price, imgUrl){
    const carrinho = this;

    for (let idx = 0; idx < carrinho.Produtos.length; idx++) {
        const item = carrinho.Produtos[idx];

        if (item.Id == id) {
            // item ja existente no carrinho
            item.Quantidade += qntd;
            return;
        }
    }
    // item nao existente no carrinho

    if (type !== "cesta")
        carrinho.Produtos.push({
            Id: id, 
            Quantidade: qntd,
            Tipo: type,
            Nome: name.trim(),
            Estoque: stock,
            Preco: price,
            ImagemUrl: imgUrl,
            Cesta: false
        });
    else {
        const items_cesta = await Cesta.findById(id);

        carrinho.Produtos.push({
            Id: id, 
            Quantidade: qntd,
            Tipo: type,
            Nome: name.trim(),
            Estoque: stock,
            Preco: price,
            ImagemUrl: imgUrl,
            Cesta: true,
            Produtos: items_cesta.Produtos
        });
    }
        
}

CarrinhoSchema.methods.remove_item = async function(id){
    const carrinho = this;

    carrinho.Produtos = carrinho.Produtos.filter( item => {
        return item.Id != id;
    })
}

CarrinhoSchema.methods.update_item = async function(id, qntd){
    const carrinho = this;

    for (let idx = 0; idx < carrinho.Produtos.length; idx++) {
        const item = carrinho.Produtos[idx];

        if (item.Id == id) {
            // item ja existente no carrinho
            if (item.Tipo == "cesta") {
                // nao deixa ficar com quantidade negativa
                if (qntd < 0) return;
                else item.Quantidade = qntd;
            } else {
                // nao deixa ficar com quantidade menor q 100g
                if (qntd < 100) return;
                else item.Quantidade = qntd;
            }
            return;
        }
    }
}

module.exports = mongoose.model('Carrinho', CarrinhoSchema);