const inputs = document.querySelectorAll("input");
const form = document.querySelector("form");
const api = "/AtualizaCliente"
const Nome = document.querySelector("#Nome");
const Email = document.querySelector("#Email");
const Endereco1 = document.querySelector("#adress");
const Endereco2 = document.querySelector("#adress2");
const Endereco3 = document.querySelector("#adress3");
const Celular = document.querySelector("#Celular");

const save = async (Nome, Email, Endereco, Celular) => {
  console.log("requesting")
  return fetch(api, {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    method: "PATCH",
    body: JSON.stringify({Nome, Email, Endereco, Celular })
  })
    .then( async response => {
      if (response.status !== 200) throw new Error("Dados inválidos!");
      
      return "Dados atualizados com sucesso!";
    })
    .catch( (erro) => {
      return "Verifique sua conexão com a internet ou tente mais tarde!"});
}

const toggle_disabled = () => inputs.forEach(input => {
  // inverte o estado de ativo dos inputs
  if (input.type !== "submit") {
    input.disabled = !input.disabled;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = form.querySelector("#end");

  toggle_disabled();
  if (button.value === "Editar") {
    button.value = "Salvar";
  } else {
    button.disabled = "disabled";
    let Endereco = {
      Complemento: Endereco1.value,
      Bairro: Endereco2.value,
      Numero: Endereco3.value,
    }
    await save(Nome.value, Email.value, Endereco, Celular.value)
      .then( result => {
        alert(result);
      })
      .catch(erro => {
        alert(erro);
      })
      .finally(() => {
        button.value = "Editar";
        button.disabled = "";
      });
  }
})
