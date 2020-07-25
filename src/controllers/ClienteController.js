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
        // const {Nome, CPF, Email, Senha, Endereco, Celular } = req.body;  

        const cliente_existente = await Cliente.findOne({CPF: req.body.CPF});

        if(!cliente_existente){    
            if(true){//ValidaCPF(CPF)){
                cliente = new Cliente(req.body);   
                const token = await cliente.criarToken();
                
                // salva o token no cookie
                req.session.token = token;
                req.session._id = cliente._id;
                req.session.save();

                return res.json(cliente).send();
            }
        }
        return res.status(400).json( { error : "Cliente ja cadastrado com este CPF!" } ).send();
    },

    async update(req,res, next){
        try {        
            const cliente = await Cliente.findByIdAndUpdate({_id: req.session.id}, req.body);
            if (!cliente) return res.status(400);

            return res.status(200).send();
        } catch (error) {
            return res.status(500).send();
        }
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
