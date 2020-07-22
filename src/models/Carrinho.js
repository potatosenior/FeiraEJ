const mongoose = require('mongoose');

const CarrinhoSchema = new mongoose.Schema({
    Id_Cliente: String,         
    Id_Produto:String,
    Quantidade: Number,
    Subtotal: Number
});

module.exports = mongoose.model('Carrinho', CarrinhoSchema);