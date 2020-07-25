const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');
const Cesta = require('../models/Cesta');

async function updateEstoqueProduto(Estoque, Id_Produto){
    await Produto.updateOne({_id:Id_Produto}, {Estoque});
    return ({ message: "Produto atualizado com sucesso" });    
}

module.exports = {
    async index(req,res){
        const Id_Cliente = req.headers.id_cliente;
        const carrinho = await Carrinho.find({Id_Cliente:Id_Cliente});
        return res.json(carrinho);
    },   

    async remove(req,res){
        var total = 0, i=0, Id_Produto, j=0;
        const Id_Cliente = req.headers.id_Cliente; 

        let Subtotais = await Carrinho.find({id_cliente:Id_Cliente});

        while(Subtotais[i] !=null){ // verificar se é cesta e tratar
            Id_Produto = Subtotais[i].Id_Produto; //Pega o id do produto da compra
            Id_Compra = Subtotais[i]._id; 
            var Info_Produto = await Produto.findOne({_id:Id_Produto}, {Estoque:1, Nome:1}); //Pega info dos produtos

            if(!Info_Produto){ //é uma cesta
                const Id_Produtos_Cestas = await Cesta.findOne({Info_Produto}, {Id_Produtos:1, Quantidade:1});
                j=0
                var okay =0
                while(Id_Produtos_Cestas.Quantidade.length > j){
                    const Info_Produto = await Produto.findOne({_id:Id_Produtos_Cestas.Id_Produtos[j]}, {Estoque:1, Nome:1});
                    const Quantidade_Comprada = Subtotais[i].Quantidade * Id_Produtos_Cestas.Quantidade[j];
                    if(Info_Produto.Estoque >= Quantidade_Comprada){ //verifica se possui quantidade no estoque
                        const EstoqueFinal = Info_Produto.Estoque - Quantidade_Comprada; //calcula o estoque final apos finalização da compra
                        updateEstoqueProduto(EstoqueFinal,Id_Produtos_Cestas.Id_Produtos[j]);
                        }else{
                        console.log("Nao possuimos a quantidade desejada no estoque para o produto: " + Info_Produto.Nome);
                        okay =1;
                    }
                    j++;
                }

                if(okay == 0){
                    total+= Subtotais[i].Subtotal;
                    await Carrinho.deleteOne({_id: Id_Compra});    
                }
            }else{ //é um produto
                if(Info_Produto.Estoque >= Subtotais[i].Quantidade){ //verifica se possui quantidade no estoque
                    EstoqueFinal = Info_Produto.Estoque - Subtotais[i].Quantidade; //calcula o estoque final apos finalização da compra
                    total +=Subtotais[i].Subtotal;
                    updateEstoqueProduto(EstoqueFinal,Id_Produto);
                    await Carrinho.deleteOne({_id: Id_Compra});
                }else{
                console.log("Nao possuimos a quantidade desejada no estoque para o produto: " + Info_Produto.Nome);
                }
            }
            i++;
        }
        return res.json( {message: "Pagamento realizado com sucesso, total da compra: " + total} );
    }
}