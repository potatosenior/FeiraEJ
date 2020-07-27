const form = document.querySelector("form");
const name = document.querySelector("#name");
const cpf = document.querySelector("#cpf");
const Endereco1 = document.querySelector("#adress");
const Endereco2 = document.querySelector("#adress2");
const Endereco3 = document.querySelector("#adress3");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const api = "/CadastroCliente";

const register = async (name, cpf, email, password, phone, adress) => {
  // console.log(name, cpf, email, password, phone, adress)
  return fetch(api, {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      Nome: name,
      CPF: cpf,
      Email: email,
      Senha: password,
      Celular: phone,
      Endereco: adress
    })
  })
    .then( async response => {
      if (response.status != 200) {
        return {error: "Algum campo inválido!"};
      }
      return "Sucesso"
    })
    .catch( (error) => {return "Verifique sua conexão com a internet e tente mais tarde!"});
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  if (password.value !== password2.value){
    password.focus()
    return alert('As senhas devem ser igual')
  } 
  let adress = {
    Complemento: Endereco1.value,
    Bairro: Endereco2.value,
    Numero: Endereco3.value,
  }
  await register(name.value, cpf.value, email.value, password.value, phone.value, adress)
    .then( data => {
      if (data.error){
        return alert(data.error);
      }
      // usuario criado com sucesso
      console.log('sucess')
      window.location.href = "/";
    })
    .catch( error => {
      alert(error);
    });
});