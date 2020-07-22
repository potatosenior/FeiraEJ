//index, show, store, update, destroy
const Cliente = require('../models/Cliente');



module.exports = {
    async store(req,res){
        const {Nome, CPF, Email, Senha, Endereco, Celular } = req.body;      
        
        let cliente = await Cliente.findOne( { CPF } );

        if(!cliente){

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
                }
                var resto = (a*10%11)%10;
                if(CPF[10] == resto ){
                    cliente = await Cliente.create({ Nome, CPF, Email, Senha, Endereco, Celular });
                    return res.json(cliente);
                }

            }
            return res.json( { message : "CPF invalido" } ); 

        }
        return res.json( { message : "Cliente ja cadastrado" } );
    },

    async update(req,res){
        const {Nome, Email, Senha, Endereco, Celular } = req.body;
        
        const cliente = await Cliente.updateOne({Nome, Email, Senha, Endereco, Celular});

        return res.json(cliente);
    },

    async delete(req,res){
        const {CPF} = req.body;

        await Cliente.deleteOne({CPF:CPF});

        return res.json( { message:  "Cliente deletado com sucesso"} );
    },

    async index(req,res){
        const cliente = await Cliente.find();

        return res.json(cliente);
    }

}