const mongoose = require('mongoose');

const CestaSchema = new mongoose.Schema({
    Imagem: String,
    Produtos: [{
        Id: mongoose.Schema.Types.ObjectId,
        Quantidade: Number,
        Nome: String
    }],
    tipo:String,
    Preco:Number,
    Nome: String
});

module.exports = mongoose.model('Cesta', CestaSchema);