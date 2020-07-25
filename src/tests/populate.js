const mongoose = require('mongoose');
const Produto = require('../models/Produto');
const Cesta = require('../models/Cesta');

const criar_produto = async () => {
  const produto = new Produto({
    Estoque: Math.floor((Math.random() + 70) * 90  * 100) / 100, // gera um valor aleario de 70 a 90
    Preco: Math.floor((Math.random() + 7) * 20  * 100) / 100, // gera um valor aleario de 0.25 a 5
    Nome: "Soja".trim(),
    Tipo: "grao",
    ImagemUrl: "https://s2.glbimg.com/15GarrxeLT-OIJD5oilBMupuf8E=/0x0:1600x1067/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2017/w/H/mCc1omR9qyuB5UXCVG8A/2.png"
  })
  await produto.save();
  console.log("Salvo ", produto.toJSON().Nome)
}

const criar_cestas = async () => {
  const produtos = await Produto.find({Tipo: "fruta"});
  // -1 pra se for 10 produtos, n tentar escolher um produto no idx 10, pois começa no 0

  const qntd = produtos.length -1;
  console.log("quantidade de produtos: ", qntd);

  const prod_idxs = []; // produtos que ja estao em alguma cesta
  for (let i = 0; i < Math.floor(qntd/5); i++) {
    let produtos_cesta = []; // produtos na cesta
    let preco = 0; // preco total da cesta

    for (let j = 0; j < 5; j++) {
      // pega 5 indices de produtos aleatorios nao repetidos e adiciona uma quantidade aleatória do produto à cesta
      let idx = Math.floor((Math.random() * qntd));
    
      if (!prod_idxs.includes(idx)) {
        let Quantidade = Math.floor((Math.random() * 8)) * 100 + 200; // de 200 a 800 gramas ou n

        produtos_cesta.push({
          Id: Object(produtos[idx])._id,
          Quantidade,
          Nome: Object(produtos[idx]).Nome
        });
        
        prod_idxs.push(idx);
        preco += Math.floor(Object(produtos[idx]).Preco * (Quantidade / 1000) * 100) / 100; // preco por kg * gramas / 1kg,exemplo: 2,50 kg * 500/1000 = 1,25
        preco = Number( ( Math.round(preco * 100) / 100 ).toFixed(2) ); // deixa 2 casas decimais, 00.00
      }
      else
        j--;
    }
  
    // Cria e salva a cesta
    await new Cesta({
      Produtos: produtos_cesta,
      tipo: "Cesta",
      Preco: Number((preco * 0.8).toFixed(2)), // 20% de desconto pra compensar comprar a cesta inves de comprar os itens separados
      Nome: "Cesta de frutas " + (i+1)
    }).save();
    console.log("Cesta " + (i+1) + " criada!")
  }
}

const consertar = async () => {
  const cestas = await Cesta.find({});

  for (let idx = 0; idx < cestas.length - 1; idx++) {
    cestas[idx].Cesta = true;   
    console.log(cestas[idx].Cesta)
    await cestas[idx].save();
  }
}

mongoose.connect('mongodb+srv://FeiraEJ:FeiraEJ@feiraej.wr1cu.mongodb.net/FeiraEJ?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(async () => {
  await consertar().then(() => mongoose.disconnect());
})