const Cesta = require('../models/Cesta');


module.exports = {
    async index(req,res){
        const cesta = await Cesta.find();
        return res.json(cesta);
    },

    async store(req,res){
        const {Imagem} = req.file;
        const {Preco,Quantidade,Id_Produtos, tipo} = req.body;      

        const InfoCesta = await Cesta.create({
            Imagem, 
            Preco, 
            Id_Produtos:Id_Produtos.split(',').map(Ids=>Ids.trim()),
            Quantidade: Quantidade.split(',').map(Quantidades=> Quantidades.trim()), 
            tipo
        });
        
        return res.json(InfoCesta);
    },

    async destroy(req,res){
        const {id} = req.params;

        await Cesta.deleteOne({_id:id});

        return res.json({message: "Cesta deletada com sucesso"});
    }
}