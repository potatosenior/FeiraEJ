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
  const logged = false
// rotas para as paginas html
app.get('', (req, res) => {
  res.render('home', {
    home: true,
    logged
  });
});

app.get('/Login', (req, res) => {
  res.render('login', {
    login: true,
    logged
  });
});

app.get('/Cadastro', (req, res) => {
  res.render('cadastro', {
    cadastro: true,
    logged
  });
});

app.get('/Conta', (req, res) => {
  res.render('conta', {
    conta: true,
    logged
  });
});

module.exports = app;