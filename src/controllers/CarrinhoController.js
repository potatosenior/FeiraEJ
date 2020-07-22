const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');
const Cesta = require('../models/Cesta');

async function updateCompra(Id_Cliente,Id_Produto ,Quantidade,Subtotal){
    await Carrinho.updateOne({Id_Cliente:Id_Cliente, Id_Produto:Id_Produto}, {Id_Cliente,Id_Produto ,Quantidade,Subtotal});
    return("atualizado");
}

module.exports = {
    async index(req,res){
        const carrinho = await Carrinho.find();
        return res.json(carrinho);
    },
    
    async store(req,res){
        const {Quantidade} = req.body;
        const {Id_Produto} = req.params;
        const Id_Cliente = req.headers.id_cliente;
        var carrinho
        var Info_Produto;
        var i =0
        
        Info_Produto = await Produto.findOne( {_id:Id_Produto }, { Preco: 1, Estoque:1} );
        if(Info_Produto){//Se não estiver na tabela produto então é uma cesta
            if(Info_Produto.Estoque < Quantidade) {
                return res.json({ message: "Nao possuimos a quantidade desejada em estoque"});
            }else{
                const ProdCarrinho = await Carrinho.findOne({Id_Cliente,Id_Produto});
                if(!ProdCarrinho){
                    const Subtotal = Quantidade * Info_Produto.Preco;    
                    carrinho = await Carrinho.create( { Id_Cliente,Id_Produto ,Quantidade,Subtotal }); 
                }
                else{
                    const novoValor = Quantidade + ProdCarrinho.Quantidade;
                    if(novoValor< Info_Produto.Estoque){
                        const Subtotal = novoValor * Info_Produto.Preco;
                        carrinho = await updateCompra(Id_Cliente,Id_Produto,novoValor,Subtotal);
                    }
                    else{
                        return res.json({ message: "Nao possuimos a quantidade desejada em estoque"});
                    }
                }
            }
        }else{ //é uma cesta
            Info_Produto = await Cesta.findOne({_id: Id_Produto});
            while( i < Info_Produto.Quantidade.length){
                var Info_Produto_Cesta = await Produto.findOne({_id: Info_Produto.Id_Produtos[i]}, {Estoque:1});               
                if( Info_Produto_Cesta.Estoque < ( Info_Produto.Quantidade[i]*Quantidade ) ){ //verifica se tem a quantidade desejada em estoque
                    return res.json({ message: "Nao possuimos a quantidade desejada em estoque de um dos produtos da cesta"});
                }
                i++;
            }
            const ProdCarrinho = await Carrinho.findOne({Id_Cliente,Id_Produto});
            if(!ProdCarrinho){
                const Subtotal = Quantidade * Info_Produto.Preco;    
                carrinho = await Carrinho.create( { Id_Cliente,Id_Produto ,Quantidade,Subtotal}); 
            }
            else{
                var novoValorEstoque =0;
                var Prod;
                while(i < Info_Produto.length)
                {
                    Prod = await Produto.findOne( {_id:Id_Produto }, {Estoque:1} )
                    novoValorEstoque = (Info_Produto.Quantidade[i]*Quantidade) + (ProdCarrinho.Quantidade*Info_Produto.Quantidade[i]);
                    if(novoValorEstoque > Prod.Estoque){
                        return res.json({message: "Nao há quantidade deseja de um dos produtos da cesta"});
                    }
                }
                const novaQuant = ProdCarrinho.Quantidade + Quantidade;
                const Subtotal = novaQuant * Info_Produto.Preco
                carrinho = await updateCompra(Id_Cliente,Id_Produto,novaQuant,Subtotal);
            }
        }
        return res.json(carrinho)
    },

    async remove(req,res){
        const {id} = req.params;

        await Carrinho.deleteOne({_id:id});

        return res.json({ message: "Deletado com sucesso"});
    }
}