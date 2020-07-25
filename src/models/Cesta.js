const mongoose = require('mongoose');

const CestaSchema = new mongoose.Schema({
    ImagemUrl: String,
    Produtos: [{
        Id: mongoose.Schema.Types.ObjectId,
        Quantidade: Number,
        Nome: String,
        Tipo: String
    }],
    tipo:String,
    Preco:Number,
    Nome: String,
    Estoque: Number,
    Cesta: Boolean
});

module.exports = mongoose.model('Cesta', CestaSchema);