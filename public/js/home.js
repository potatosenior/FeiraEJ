const api = "/AdicionaProduto/"
//seleciona todos produtos
const produtos = document.querySelectorAll(".main-section-item.produto");
//seleciona todas cestas
const cestas = document.querySelectorAll(".main-section-item.cesta");

// seleciona os spans de preços
const precos = document.querySelectorAll("[data-preco]");

precos.forEach( preco => {
  // formata o preço pra XX,XX
  const preco_bruto = preco.getAttribute("data-preco");

  if (preco_bruto < 10) {
    if (preco_bruto.length <= 3){
      preco.textContent += "0";
    }
  }
  preco.textContent = preco.textContent.replace(".", ",");
})

const add_item = async (_id, quantidade, tipo) => {
  return fetch(api + encodeURI(_id), {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({Quantidade: quantidade, Tipo: tipo})
  })
    .then( async response => {
      if (response.status !== 200) throw new Error("response status: " + response.status);
      return "Item adicionado com sucesso!"
    })
    .catch( (error) => "Verifique sua conexão com a internet ou tente mais tarde!");
}

produtos.forEach( produto => {
  // botao de adicionar
  const button = produto.querySelector('button[name="add"]');

  const div_qntd = produto.querySelector('div');
  // seleciona o input manual
  const input_qntd = div_qntd.querySelector('input[name="quantity"]');
  // seleciona os botoes de aumentar ou diminuir a quantidade
  // const decrease = div_qntd.querySelector('form[name="decrease"]').querySelector("input");
  // const increase = div_qntd.querySelector('form[name="increase"]').querySelector("input");
  // seleciona o estoque bruto
  const estoque = produto.querySelector("[data-estoque]");
  const estoque_bruto = Number(estoque.getAttribute("data-estoque"));

  // formata o estoque pra XX,XXX K/g
  estoque.textContent = Number(estoque_bruto / 1000).toFixed(3) + " K/g";
  estoque.textContent = estoque.textContent.replace(".", ",");

  input_qntd.addEventListener("change", function() {
    // nao deixa diminuir para menor que 100g
    if (input_qntd.value < 100) input_qntd.value = 100;
    // nao deixar aumentar mais que o estoque
    if (input_qntd.value > estoque_bruto) input_qntd.value = estoque_bruto;
  });

  input_qntd.addEventListener("input", function(e) {
      // nao deixa inserir mais de 4 numeros
      if (this.value.length > 4) this.value = this.value.slice(0, this.maxLength)
    });
  
  // seleciona a div do input e seleciona o input qnd clicar nela
  // necessario pra selecionar o input quando clicar no sufixo de grama(g)
  div_qntd.querySelector("div").addEventListener("click", () => input_qntd.focus())
  
  // seleciona os botoes de quantidade
  div_qntd.querySelectorAll('input[name="pop"]').forEach(button => {
    button.addEventListener("click", function(){
      if (this.value === "+") {
        input_qntd.value = Number(input_qntd.value) + 50;
      } else {
        input_qntd.value = Number(input_qntd.value) - 50;
      }
      // nao deixa diminuir para menor que 100g
      if (input_qntd.value < 100) input_qntd.value = 100;
      // nao deixar aumentar mais que o estoque bruto

      if (input_qntd.value > estoque_bruto) input_qntd.value = estoque_bruto;
    })
  })

  button.addEventListener("click", async () => {
    add_item(produto.id, Number(input_qntd.value), "produto")
      // .then(result => alert(result))
      .catch(erro => alert(erro))
  })
})

cestas.forEach( cesta => {
  // botao de adicionar
  const button = cesta.querySelector('button[name="add"]');
  
  const div_qntd = cesta.querySelector('div');
  // seleciona o input manual
  const input_qntd = div_qntd.querySelector('input[name="quantity"]');
  // seleciona os botoes de aumentar ou diminuir a quantidade
  // const decrease = div_qntd.querySelector('form[name="decrease"]').querySelector("input");
  // const increase = div_qntd.querySelector('form[name="increase"]').querySelector("input");
  const estoque = cesta.querySelector("[data-estoque]");
  // seleciona o estoque bruto
  const estoque_bruto = Number(estoque.getAttribute("data-estoque"));

  input_qntd.addEventListener("change", function() {
    // nao deixa diminuir para menor que 1
    if (input_qntd.value < 1) input_qntd.value = 1;
    // nao deixar aumentar mais que o estoque
    if (input_qntd.value > estoque_bruto) input_qntd.value = estoque_bruto;
  });

  input_qntd.addEventListener("input", function(e) {
    // nao deixa inserir mais de 2 numeros
    if (this.value.length > 2) this.value = this.value.slice(0, this.maxLength)
  });

  div_qntd.querySelectorAll('input[name="pop"]').forEach(button => {
    button.addEventListener("click", function(){
      if (this.value === "+") {
        input_qntd.value = Number(input_qntd.value) + 1;
      } else {
        input_qntd.value = Number(input_qntd.value) - 1;
      }
      // nao deixa diminuir para menor que 1
      if (input_qntd.value < 1) input_qntd.value = 1;
      // nao deixar aumentar mais que o estoque bruto
      if (input_qntd.value > estoque_bruto) input_qntd.value = estoque_bruto;
    })
  });

  button.addEventListener("click", async () => {
    add_item(cesta.id, Number(input_qntd.value), "cesta")
      .then(result => alert(result))
      .catch(erro => alert(erro))
  });
})