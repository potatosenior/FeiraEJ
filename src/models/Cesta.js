const mongoose = require('mongoose');

const CestaSchema = new mongoose.Schema({
    Cesta = [{
        IDProduto:Number,
        Quantidade:Number
    }],
    Preco:Number
});

module.exports = mongoose.model('Cesta', CestaSchema);