const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    Nome : String,
    CPF : String,
    Email: String,  
    Senha: String,
    Endereco: {
        Bairro: String,
        Tipo_Logadouro: String,
        Nome_Logadouro: String,
        Numero: Number,
        Complemento: String
    },
    Celular: Number,
});

module.exports = mongoose.model('Cliente', ClienteSchema);