const mongoose = require('mongoose');

const ProdutosSchema = new mongoose.Schema({
    Imagem: {
        type: Buffer
    },
    Estoque: {
        type: Number,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
    Nome: {
        type: String,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
    Tipo: {
        type: String,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
    Preco: {
        type: Number,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
});

module.exports = mongoose.model('Produto', ProdutosSchema);