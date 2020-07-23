const mongoose = require('mongoose');

const ProdutosSchema = new mongoose.Schema({
    Imagem: String,
    Estoque: Number,
    Nome: String,
    Tipo: String,
    Preco: Number,
    ImagemUrl: String
});

module.exports = mongoose.model('Produto', ProdutosSchema);