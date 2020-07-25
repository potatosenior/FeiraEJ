const add_item = async (_id, quantidade, tipo) => {
  return fetch("/AdicionaProduto/" + encodeURI(_id), {
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

const update_item = async (_id, quantidade) => {
  return fetch("/AtualizaProduto/" + encodeURI(_id), {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    method: "PATCH",
    body: JSON.stringify({qntd: quantidade})
  })
    .then( async response => {
      if (response.status !== 200) throw new Error("response status: " + response.status);
      return "Quantidade atualizada com sucesso!"
    })
    .catch( (error) => "Verifique sua conexão com a internet ou tente mais tarde!");
}

const remove_item = async (_id, quantidade, tipo) => {
  return fetch("/RemoveProdutoCarrinho/" + encodeURI(_id), {
    method: "DELETE"
  })
    .then( async response => {
      if (response.status !== 200) throw new Error("response status: " + response.status);
      return "Item removido com sucesso!"
    })
    .catch( (error) => "Verifique sua conexão com a internet ou tente mais tarde!");
}

//seleciona todos items
const items = document.querySelectorAll(".carrinho__item.produto");
//seleciona todas cestas
const cestas = document.querySelectorAll(".carrinho__item.cesta");
// seleciona os campos de preços
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

items.forEach( item => {
  const div_qntd = item.querySelector('div');
  // seleciona os botoes de adicionar/diminuir quantidade
  const button_qntd = item.querySelectorAll('input[name="pop"]');
  // seleciona o botao de remover item
  const button_remove = item.querySelector('svg');
  // seleciona o input manual
  const input_qntd = div_qntd.querySelector('input[name="quantity"]');
  // seleciona o estoque bruto
  const estoque = item.querySelector("[data-estoque]");

  const estoque_bruto = Number(estoque.getAttribute("data-estoque"));

  // formata o estoque pra XX,XXX K/g
  estoque.textContent = Number(estoque_bruto / 1000).toFixed(3) + " K/g";
  estoque.textContent = estoque.textContent.replace(".", ",");

  input_qntd.addEventListener("change", async function() {
    // nao deixa diminuir para menor que 100g
    if (input_qntd.value < 100) input_qntd.value = 100;
    // nao deixar aumentar mais que o estoque
    if (input_qntd.value > estoque_bruto) input_qntd.value = estoque_bruto;
    
    input_qntd.disabled = true;
    await update_item(item.id, input_qntd.value)
      .then(result => alert(result))
      .catch(erro => alert(erro));
      this.disabled = false;
    input_qntd.disabled = false;
  });

  input_qntd.addEventListener("input", function(e) {
      // nao deixa inserir mais de 4 numeros
      if (this.value.length > 4) this.value = this.value.slice(0, this.maxLength)
    });

  button_qntd.forEach( btn => 
    btn.addEventListener("click", async function(){
      if (this.value === "+") {
        input_qntd.value = Number(input_qntd.value) + 50;
      } else {
        input_qntd.value = Number(input_qntd.value) - 50;
      }
      // nao deixa diminuir para menor que 100g
      if (input_qntd.value < 100) return input_qntd.value = 100;
      // nao deixar aumentar mais que o estoque bruto
      if (input_qntd.value > estoque_bruto) return input_qntd.value = estoque_bruto;
      this.disabled = true;
      await update_item(item.id, input_qntd.value)
        .then(result => alert(result))
        .catch(erro => alert(erro));
        this.disabled = false;
    })
  );
  button_remove.addEventListener("click", async () => {
    await remove_item(item.id)
      .then(result => {
        // alert(result)
        div_qntd.classList.toggle("hidden");
        item.querySelector("img").classList.toggle("hidden");
        item.querySelector("h2").classList.toggle("hidden");
        item.querySelector("h3").classList.toggle("hidden");
        item.querySelector("svg").classList.toggle("hidden");
        let div = item.querySelector(".delete")
        console.log("mostrar !!");
        div.classList.toggle("shown");
        setTimeout(() => {
          item.classList.toggle("remove")
          // div.classList.toggle("remove")
          console.log("remover");
          setTimeout(() => item.remove(), 500)
        }, 2000);
      })
      .catch(erro => alert(erro));
  })

});

cestas.forEach( item => {
  const div_qntd = item.querySelector("[data-div_qntd]");
  // seleciona os botoes de adicionar/diminuir quantidade
  const button_qntd = item.querySelectorAll('input[name="pop"]');
  // seleciona o botao de remover item
  const button_remove = item.querySelector('svg');
  // seleciona o input manual
  const input_qntd = div_qntd.querySelector('input[name="quantity"]');
  // seleciona o estoque bruto
  const estoque = item.querySelector("[data-estoque]");
  const estoque_bruto = Number(estoque.getAttribute("data-estoque"));

  input_qntd.addEventListener("change", async function() {
    // nao deixa diminuir para menor que 1
    if (input_qntd.value < 1) input_qntd.value = 1;
    // nao deixar aumentar mais que o estoque
    if (input_qntd.value > estoque_bruto) input_qntd.value = estoque_bruto;
    
    input_qntd.disabled = true;
    await update_item(item.id, input_qntd.value)
      .then(result => alert(result))
      .catch(erro => alert(erro));
      this.disabled = false;
    input_qntd.disabled = false;
  });

  input_qntd.addEventListener("input", function(e) {
      // nao deixa inserir mais de 3 numeros
      if (this.value.length > 3) this.value = this.value.slice(0, this.maxLength)
    });

  button_qntd.forEach( btn => 
    btn.addEventListener("click", async function(){
      if (this.value === "+") {
        input_qntd.value = Number(input_qntd.value) + 1;

      } else {
        input_qntd.value = Number(input_qntd.value) - 1;
      }
      // nao deixa diminuir para menor que 1
      if (input_qntd.value < 1) return input_qntd.value = 1;
      // nao deixar aumentar mais que o estoque bruto
      if (input_qntd.value > estoque_bruto) return input_qntd.value = estoque_bruto;
      this.disabled = true;
      await update_item(item.id, input_qntd.value)
        .then(result => alert(result))
        .catch(erro => alert(erro));
      this.disabled = false;
    })
  );

  button_remove.addEventListener("click", async () => {
    await remove_item(item.id)
      .then(result => {
        // alert(result)

      })
      .catch(erro => alert(erro));
  })

});