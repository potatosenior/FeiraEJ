const mongoose = require('mongoose');

const CestaSchema = new mongoose.Schema({
    Cesta = [{
        IDProduto: {
            type: Number,
            trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
            required: true
        },
        Quantidade: {
            type: Number,
            trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
            required: true
        },
    }],
    Preco: {
        type: Number,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
});

module.exports = mongoose.model('Cesta', CestaSchema);