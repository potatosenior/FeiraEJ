const mongoose = require('mongoose');

const CestaSchema = new mongoose.Schema({
    Imagem: String,
    Id_Produtos:[String],
    Quantidade: [Number],
    tipo:String,
    Preco:Number
});

module.exports = mongoose.model('Cesta', CestaSchema);