const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const session = require('cookie-session');

const Produto = require('./models/Produto');
const Cliente = require('./models/Cliente');
const Cesta = require('./models/Cesta');
const { index } = require('./controllers/CarrinhoController');
const auth = require("./middleware/auth");
const redirect_if_auth = require("./middleware/redirect_if_auth");

const routes = require('./routes');

mongoose.connect('mongodb+srv://FeiraEJ:FeiraEJ@feiraej.wr1cu.mongodb.net/FeiraEJ?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();
// diretório dos arquivos publicos
const public_dir = path.join(__dirname, "../public");

// especifica qual é o diretorio publico/estatico no express
app.use(express.static(public_dir));
app.use(express.json());
app.use(session({
  name: "token",
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*60*24*365 } // milisec / 1 ano tempo de duração do cookie
}))
app.use(routes);

// set views path (default = views)
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// handlebars engine e local das views, partials
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use((req, res, next) => {
  // função q roda em todo request
  req.session.isLogedIn = !!(req.session.token && req.session.id);
  req.session.save();
  next();
})
// rotas para as paginas html
app.get('', async (req, res) => {
  // $gt é o valor minimo, no caso só > 0 vao aparecer
  res.render('home', {
    home: true,
    logged: req.session.isLogedIn,
    hortalicas: await Produto.find({Tipo: "hortalica", Estoque: {$gt: 0}}) || [],
    graos: await Produto.find({Tipo: "grao", Estoque: {$gt: 0}}) || [],
    frutas: await Produto.find({Tipo: "fruta", Estoque: {$gt: 0}}) || [],
    cestas: await Cesta.find({Estoque: {$gt: 0}}) || [],
  });
  if (!req.session.token) {

  }
});

app.get('/login', redirect_if_auth, (req, res) => {
  res.render('login', {
    login: true,
    logged: req.session.isLogedIn
  });
});

app.get('/cadastro', redirect_if_auth, (req, res) => {
  res.render('cadastro', {
    cadastro: true,
    logged: req.session.isLogedIn
  });
});

app.get('/conta', auth, async (req, res) => {
  res.render('conta', {
    conta: true,
    dados: await Cliente.findById(req.session.id),
    logged: req.session.isLogedIn
  });
});

app.get('/carrinho', async (req, res) => {
  const carrinho = await index(req);

  res.render('carrinho', {
    logged: req.session.isLogedIn,
    produtos: carrinho.Produtos,
    subtotal: carrinho.Subtotal
  });
});

app.get('/ajuda', (req, res) => {
  res.render('ajuda', {
    logged: req.session.isLogedIn
  });
});

app.get('/compra', auth, (req, res) => {
  res.render('compra', {
    logged: req.session.isLogedIn
  });
});

// Qualquer outra rota que nao esteja definida
app.get('*', (req, res) => {
  res.render('erro', {
    code: 404,
    message: "Página não encontrada",
    button_text: "Voltar ao site",
    button_url: "/",
    logged: req.session.isLogedIn
  });
});



module.exports = app;