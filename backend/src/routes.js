const express = require('express');

const SessionController = require('./controllers/SessionController')
const LoginController = require('./controllers/LoginController');

const routes = express.Router();

routes.post('/Cadastro',SessionController.store);

routes.post('/Login',LoginController.store);


module.exports = routes;