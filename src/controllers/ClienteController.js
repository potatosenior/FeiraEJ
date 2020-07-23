//index, show, store, update, destroy
const Cliente = require('../models/Cliente');

function ValidaCPF(CPF){
    var a = 0, i, mult=10;

    for(i=0; i<9; i++){
        a += CPF[i]*mult;
        mult--;
    }
    
    var resto = (a*10%11)%10;
    if(CPF[9] == resto ){
        a=0
        mult = 11;
        for(i=0; i<10; i++){
            a += CPF[i]*mult;
            mult--;
            resto = (a*10%11)%10;
            if(CPF[10] == resto ){
                return 1;
            }
        }
    }
    return 0;
}

module.exports = {
    async store(req,res){
        const {Nome, CPF, Email, Senha, Endereco, Celular } = req.body;  
        
        let cliente = await Cliente.findOne( { CPF } );

        if(!cliente){    
            if(true){//ValidaCPF(CPF)){
                cliente = await Cliente.create({Nome, CPF, Email, Senha, Endereco, Celular});        
                return res.json(cliente).send();
            }
        }
        return res.status(400).json( { error : "Cliente ja cadastrado com este CPF!" } ).send();
    },

    async update(req,res){
        const {Nome, Email, Senha, Endereco, Celular } = req.body;
        const _CPF = req.headers._cpf;
        
        const cliente = await Cliente.findOneAndUpdate({CPF: _CPF}, {Nome, Email, Senha, Endereco, Celular});

        return res.json(cliente);
    },

    async delete(req,res){ //deletar carrinho dele tbm
        const {Id} = req.body;

        await Cliente.deleteOne({_id:Id});
        await Carrinho.delete({Id_Cliente: Id});

        return res.json( { message:  "Cliente deletado com sucesso"} );
    },

    async index(req,res){
        const cliente = await Cliente.find();

        return res.json(cliente);
    }

}
