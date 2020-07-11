const mongoose = require('mongoose');

const ProdutosSchema = new mongoose.Schema({
    Quantidade: {
        type: Number,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
    Total: {
        type: Number,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },

    CPF_fk: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cliente',
        required: true
    },
        
    IdProduto_fk:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    }
});

module.exports = mongoose.model('Produto', ProdutosSchema);