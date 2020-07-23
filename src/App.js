const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const Produto = require('./models/Produto');
const Cesta = require('./models/Cesta');

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
app.get('', async (req, res) => {
/*   const cestas = ;

  if(cestas) {
    cestas.forEach( async cesta => {
      // pra cada cesta, cria uma prop noma 'produtos' com 
      // o nome e a quantidade de cada produto na cesta
      cesta.produtos = [];

      cesta.Produtos.forEach( async produto => {
        let prod = await Produto.findById(produto.Id);
        if (!produto) return;

        cesta.produtos.push({
          Nome: prod.Nome,
          Quantidade: produto.Quantidade
        })
      })
    })
  } */

  res.render('home', {
    home: true,
    logged,
    hortalicas: await Produto.find({Tipo: "hortalica"}) || [],
    graos: await Produto.find({Tipo: "grao"}) || [],
    frutas: await Produto.find({Tipo: "fruta"}) || [],
    cestas: await Cesta.find({}) || [],
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