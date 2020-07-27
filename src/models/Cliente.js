const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

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
    Celular: String,
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

ClienteSchema.pre('save', async function (next){
    const user = this;
    // verifica se a senha foi modificada
    if (user.isModified('Senha')) {
        // descriptografa
        user.Senha = await bcrypt.hash(user.Senha, 8);
    }
  
    next();
  })

module.exports = mongoose.model('Cliente', ClienteSchema);