const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const ClienteSchema = new mongoose.Schema({
    Nome : String,
    CPF : String,
    Email: String,  
    Senha: String,
    Endereco: {
        Bairro: String,
        Numero: Number,
        Complemento: String
    },
    Celular: Number,
    tokens: [
        {
            token: {
            type: String,
            required: true
            }
        }
    ],
    Carrinho: mongoose.Schema.Types.ObjectId
});

ClienteSchema.methods.criarToken = async function() {
    const user = this;
    // gera um token novo
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    
    // salva o token
    user.tokens = user.tokens.concat({token});
    await user.save();
  
    return token;
  }

module.exports = mongoose.model('Cliente', ClienteSchema);