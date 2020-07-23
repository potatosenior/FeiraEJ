const form = document.querySelector("form");
const name = document.querySelector("#name");
const cpf = document.querySelector("#cpf");
const adress = document.querySelector("#adress");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const api = "/CadastroCliente";

const register = async (name, cpf, email, password, phone, adress) => {
  console.log(name, cpf, email, password, phone, adress)
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
      return response.json()
        .then( data => data )
        .catch( error => error )
    })
    .catch( () => { message: "Verifique sua conexão com a internet ou tente mais tarde!" });
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  if (password.value !== password2.value){
    password.focus()
    return alert('As senhas devem ser igual')
  } 
  console.log('check 1')
  await register(name.value, cpf.value, email.value, password.value, phone.value, adress.value)
  .then( data => {

    if (data.error) 
      alert(data.error);
    else {
      window.location.href = "/";
    }
  })
  .catch( error => {
    alert(error.message);
  });
});