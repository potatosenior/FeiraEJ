const mongoose = require('mongoose');

const ProdutosSchema = new mongoose.Schema({
    Imagem: String,
    Estoque: Number,
    Nome: String,
    Tipo: String,
    Preco: Number
});

module.exports = mongoose.model('Produto', ProdutosSchema);