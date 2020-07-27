const express = require('express');
const multer = require('multer');
const uploadConfig = require('./Config/upload'); 
const auth = require("./middleware/auth");
const redirect_if_auth = require("./middleware/redirect_if_auth");

const ClienteController = require('./controllers/ClienteController');
const SessionController = require('./controllers/SessionController');
const ProdutosController = require('./controllers/ProdutosController');
const CarrinhoController = require('./controllers/CarrinhoController');
const CompraController = require('./controllers/CompraController');
const CestasController = require('./controllers/CestasController');

const routes = express.Router();
const upload = multer(uploadConfig);

//Cliente
routes.post('/CadastroCliente', ClienteController.store);
routes.get('/Clientes',auth ,ClienteController.index);
routes.delete('/DeletaCliente', auth, ClienteController.delete);
routes.patch('/AtualizaCliente', auth, ClienteController.update);


//Session
routes.post('/login', SessionController.store);
routes.post('/logout', SessionController.delete);


//Produtos
routes.get('/Produtos', ProdutosController.index);
routes.post('/CadastraProduto', upload.single('Imagem'),ProdutosController.store);
routes.put('/AtualizaProduto/:Id_Produto',ProdutosController.update);
routes.delete('/DeletaProduto/:Id_Produto',ProdutosController.delete);


//Carrinho
routes.get('/Subtotal', CarrinhoController.subtotal);
routes.post('/AdicionaProduto/:id', CarrinhoController.store);
routes.patch('/AtualizaProduto/:id', CarrinhoController.update);
routes.delete('/RemoveProdutoCarrinho/:id', CarrinhoController.remove);


//Compras
routes.get('/Compras', auth, CompraController.index);
routes.delete('/Finalizar', auth, CompraController.remove);


//Cestas
routes.get('/Cestas',CestasController.index);
routes.post('/CadastraCesta',upload.single('Imagem'),CestasController.store);
routes.delete('/DeletaCesta/:id',CestasController.destroy);

module.exports = routes;