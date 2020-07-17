const mongoose = require('mongoose');

const CarrinhoSchema = new mongoose.Schema({
    Quantidade: Number,
    Subtotal: Number,

    CPF_fk: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cliente'
    },
        
    IdProduto_fk:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto'
    }
});

module.exports = mongoose.model('Carrinho', CarrinhoSchema);