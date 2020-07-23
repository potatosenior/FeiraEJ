const form = document.querySelector("form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const api = "/Login";

const login = async (email, password) => {
  console.log(email, password)
  return fetch(api, {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({Email: email, Senha: password })
  })
    .then( async response => {
      if (response.status !== 200) throw new Error;
      return response.json()
        .then( data => data )
        .catch( error => error )
    })
    .catch( () => { message: "Verifique sua conexão com a internet ou tente mais tarde!" });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  
  await login(email.value, password.value)
  .then( data => {

    if (!data) 
      alert('Login ou senha invalido!');
    else {
      window.location.href = "/"
    }
  })
  .catch( error => console.log('error: ', error))
})