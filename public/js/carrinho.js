const update_subtotal = async () => {
  return fetch("Subtotal")
    .then( async response => {

      return response.json().then(data => {
        if (data.error) return;
        else {
          // seleciona os campos de subtotal
          const subtotal = document.querySelectorAll("[data-subtotal]");

          subtotal.forEach( value => {
            // formata o subtotal pra XX,XX
            value.setAttribute("data-subtotal", String(data.Subtotal));
            value.textContent = data.Subtotal;

            if (data.Subtotal < 10) {
              if (data.Subtotal.length <= 3){
                value.textContent += "0";
              }
            }
            value.textContent = value.textContent.replace(".", ",");
          })
        }
      })
    })
    .catch( (error) => console.log("erro ", error));
}

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
      await update_subtotal();
      return "Item adicionado com sucesso!"
    })
    .catch( (error) => "Verifique sua conexão com a internet ou tente mais tarde!");
}

/* const buy = async () => {
  return fetch("/Finalizar", {
    method: "DELETE"
  })
    .then( async response => {
      if (response.status !== 200) throw new Error("response status: " + response.status);
      await update_subtotal();
      return "Compra realizada com sucesso!"
    })
    .catch( (error) => "Verifique sua conexão com a internet ou tente mais tarde!");
} */

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
      await update_subtotal();
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
      await update_subtotal();
      return "Item removido com sucesso!"
    })
    .catch( (error) => "Verifique sua conexão com a internet ou tente mais tarde!");
}
// seleciona o botao de comprar
/* document.querySelector("#buy").addEventListener("click", async (e) => {
  e.preventDefault();
  await buy();
}); */
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
    if (preco_bruto == 0) {
      preco.textContent = "0,00";
    } else 
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

  item.querySelector("[data-preco]").textContent += " K/g";

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
      /* .then(result => alert(result))
      .catch(erro => alert(erro)); */
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
        /* .then(result => alert(result))
        .catch(erro => alert(erro)); */
        this.disabled = false;
    })
  );
  button_remove.addEventListener("click", async () => {
    button_remove.classList.add("disabled");
    await remove_item(item.id)
      .then(result => {
        // alert(result)
        div_qntd.classList.toggle("hidden");
        item.querySelector("img").classList.toggle("hidden");
        item.querySelector("h2").classList.toggle("hidden");
        item.querySelector("h3").classList.toggle("hidden");
        item.querySelector("svg").classList.toggle("hidden");
        let div = item.querySelector(".delete")
        div.classList.toggle("shown");
        setTimeout(() => {
          item.classList.toggle("remove")
          setTimeout(() => item.remove(), 500)
        }, 2000);
      })
      .catch(erro => alert(erro));
  })

});

cestas.forEach( cesta => {
  const div_qntd = cesta.querySelector("[data-div_qntd]");
  // seleciona os botoes de adicionar/diminuir quantidade
  const button_qntd = cesta.querySelectorAll('input[name="pop"]');
  // seleciona o botao de remover item
  const button_remove = cesta.querySelector('svg');
  // seleciona o input manual
  const input_qntd = div_qntd.querySelector('input[name="quantity"]');
  // seleciona o estoque bruto
  const estoque = cesta.querySelector("[data-estoque]");
  const estoque_bruto = Number(estoque.getAttribute("data-estoque"));

  input_qntd.addEventListener("change", async function() {
    // nao deixa diminuir para menor que 1
    if (input_qntd.value < 1) input_qntd.value = 1;
    // nao deixar aumentar mais que o estoque
    if (input_qntd.value > estoque_bruto) input_qntd.value = estoque_bruto;
    
    input_qntd.disabled = true;
    await update_item(cesta.id, input_qntd.value)
      /* .then(result => alert(result))
      .catch(erro => alert(erro)); */
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
      await update_item(cesta.id, input_qntd.value)
        /* .then(result => alert(result))
        .catch(erro => alert(erro)); */
      this.disabled = false;
    })
  );

  /* button_remove.addEventListener("click", async () => {
    await remove_item(item.id)
      .then(result => {
        // alert(result)

      })
      .catch(erro => alert(erro));
  }) */

  button_remove.addEventListener("click", async () => {
    button_remove.disabled = true;
    await remove_item(cesta.id)
      .then(result => {
        // alert(result)
        div_qntd.classList.toggle("hidden");
        cesta.querySelector("img").classList.toggle("hidden");
        cesta.querySelector("h2").classList.toggle("hidden");
        cesta.querySelector("p").classList.toggle("hidden");
        cesta.querySelector("h3").classList.toggle("hidden");
        cesta.querySelector("svg").classList.toggle("hidden");
        let div = cesta.querySelector(".delete")
        div.classList.toggle("shown");
        setTimeout(() => {
          cesta.classList.toggle("remove")
          setTimeout(() => cesta.remove(), 500)
        }, 2000);
      })
      .catch(erro => alert(erro));
  })

});