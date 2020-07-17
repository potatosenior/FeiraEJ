const express = require('express');

const ClienteController = require('./controllers/ClienteController');
const SessionController = require('./controllers/SessionController');
const ProdutosController = require('./controllers/ProdutosController');
const CarrinhoController = require('./controllers/CarrinhoController');

const routes = express.Router();

//Cliente
routes.post('/CadastroCliente',ClienteController.store);
routes.get('/Clientes',ClienteController.index);
routes.delete('/DeletaCliente',ClienteController.delete);
routes.put('/AtualizaCliente',ClienteController.update);

routes.post('/Login',SessionController.store);

//Produtos
routes.get('/Produtos',ProdutosController.index);
routes.post('/CadastraProdutos',ProdutosController.store);
routes.delete('/DeletaProduto',ProdutosController.delete);


//Carrinho
routes.post('/AdicionaProduto/:Id_Produto',CarrinhoController.store);
routes.get('/ListaCarrinho',CarrinhoController.index);


module.exports = routes;