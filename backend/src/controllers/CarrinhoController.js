const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');

module.exports = {
    async store(req,res){
        const { Quantidade } = req.body; //Nao esta pegando a quantidade
        const {Id_Produto} = req.params;
        const Id_Cliente = req.headers;

        const Preco = await Produto.find( {_id: Id_Produto }, { Preco: 1 } );
        const Subtotal = Quantidade * Preco[0].Preco;
       // const carrinho = await Carrinho.create( { Quantidade, Subtotal, Id_Cliente.id_cliente, Id_Produto } );    
        return res.json(Subtotal);
    },

    async index(req,res){
        const carrinho = await Carrinho.find();
        return res.json(carrinho);
    },

    async destroy(req,res){
        const total = 0;
        const {Id_Cliente} = req.headers; 

        let Subtotais = await Carrinho.find({Id_Cliente});
        
        total +=Subtotais;
        
        return res.json( { message: "Total: "}, total);
    }
}