const mongoose = require('mongoose');
const validator = require('validator');

const ClienteSchema = new mongoose.Schema({
    Nome : {
        type: String,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
    CPF : {
        type: Number,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    }, //foreign key colocar ref:"Nome da tabela"
    Email: {
        type: String,
        required: true,
        unique: true, // faz com que seja unico no banco de dados
        trim: true,
        lowercase: true, // transforma pra minusculo
        validate(value){
          if (!validator.isEmail(value)){
            throw new Error("Email inválido!")
          }
        }
    },
    Senha: {
        type: String,
        required: true,
        trim: true,
        validate(value){
          if (value.length < 6){
            throw new Error("Senha muito curta!")
          }
        },
    },
    Endereco: {
        type: String,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
    Celular: {
        type: String,
        trim: true, // remove os espaços no começo e final ex: " joao " -> "joao"
        required: true
    },
});

module.exports = mongoose.model('Cliente', ClienteSchema);