const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');

const routes = require('./routes');

mongoose.connect('mongodb+srv://victor:Victor@cluster0-wr1cu.mongodb.net/FeiraEJ?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const app = express();
// diretório dos arquivos publicos
const public_dir = path.join(__dirname, "../public");

// especifica qual é o diretorio publico/estatico no express
app.use(express.static(public_dir));
app.use(express.json());
app.use(routes);

// set views path (default = views)
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// handlebars engine e local das views, partials
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// debugg
const logged = true
// rotas para as paginas html
app.get('', (req, res) => {
  res.render('home', {
    home: true,
    logged
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    login: true,
    logged
  });
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro', {
    cadastro: true,
    logged
  });
});

app.get('/conta', (req, res) => {
  res.render('conta', {
    conta: true,
    logged
  });
});

app.get('/carrinho', (req, res) => {
  res.render('carrinho', {
    conta: true,
    home: false,
    logged
  });
});

app.get('/ajuda', (req, res) => {
  res.render('ajuda', {
    conta: true,
    logged
  });
});

// Qualquer outra rota que nao esteja definida
app.get('*', (req, res) => {
  res.render('erro', {
    code: 404,
    message: "Página não encontrada",
    button_text: "Voltar ao site",
    button_url: "/",
    logged
  });
});

module.exports = app;