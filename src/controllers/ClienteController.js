//index, show, store, update, destroy
const Cliente = require('../models/Cliente');
const Carrinho = require('../models/Carrinho');

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
        const cliente_existente = await Cliente.findOne({CPF: req.body.CPF});

        if(!cliente_existente){    
            if( ValidaCPF(req.body.CPF.replace(/\D/g, "")) ){
                
                cliente = new Cliente(req.body);   
                const token = await cliente.criarToken();
                
                // salva o token no cookie
                req.session.token = token;
                req.session.id = cliente._id;
                req.session.save();

                return res.status(200).send();
            }
            return res.status(400).json({ error : "CPF invalido"}).send();
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
        await Carrinho.deleteMany({Id_Cliente: Id});

        req.session.id = null;
        req.session.token = null;
        req.session.carrinho = null;
        await req.session.save();

        return res.json( { message:  "Cliente deletado com sucesso"} );
    },

    async index(req,res){
        const cliente = await Cliente.find();

        return res.json(cliente);
    }

}
