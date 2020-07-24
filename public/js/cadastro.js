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
      console.log("response status: ", response.status);
      if (response.status !== 200) {
        throw new Error("Algum campo inválido!");
      }
      return response.json()
        .then( data => {data} )
        .catch( error => console.log("couldnt json ", error) )
    })
    .catch( (error) => {return "Verifique sua conexão com a internet e tente mais tarde!"});
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  if (password.value !== password2.value){
    password.focus()
    return alert('As senhas devem ser igual')
  } 

  await register(name.value, cpf.value, email.value, password.value, phone.value, adress.value)
    .then( data => {
      // usuario criado com sucesso
      window.location.href = "/";
    })
    .catch( error => {
      console.log(error);
      alert(error);
    });
});