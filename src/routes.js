const express = require('express');
const multer = require('multer');
const uploadConfig = require('./Config/upload'); 

const ClienteController = require('./controllers/ClienteController');
const SessionController = require('./controllers/SessionController');
const ProdutosController = require('./controllers/ProdutosController');
const CarrinhoController = require('./controllers/CarrinhoController');
const CompraController = require('./controllers/CompraController');
const CestasController = require('./controllers/CestasController');

const routes = express.Router();
const upload = multer(uploadConfig);

//Cliente
routes.post('/CadastroCliente',ClienteController.store);
routes.get('/Clientes',ClienteController.index);
routes.delete('/DeletaCliente',ClienteController.delete);
routes.put('/AtualizaCliente',ClienteController.update);


//Session
routes.post('/Login', SessionController.store);


//Produtos
routes.get('/Produtos',ProdutosController.index);
routes.post('/CadastraProduto', upload.single('Imagem'),ProdutosController.store);
routes.put('/AtualizaProduto/:Id_Produto',ProdutosController.update);
routes.delete('/DeletaProduto/:Id_Produto',ProdutosController.delete);


//Carrinho
routes.get('/ListaCarrinho',CarrinhoController.index);
routes.post('/AdicionaProduto/:Id_Produto',CarrinhoController.store);
routes.delete('/RemoveProdutoCarrinho/:id',CarrinhoController.remove);


//Compras
routes.get('/Compras',CompraController.index);
routes.delete('/Finalizar',CompraController.remove);


//Cestas
routes.get('/Cestas',CestasController.index);
routes.post('/CadastraCesta',upload.single('Imagem'),CestasController.store);
routes.delete('/DeletaCesta/:id',CestasController.destroy);

module.exports = routes;