let user=[]

function render (data){

  for (const iterador of data) {
      let contenedor = document.createElement("div");
      contenedor.innerHTML = 
      `  
      <h1>${iterador.username}</h1>
      <h1> ${iterador.email} </h1>
      <h1> ${iterador.adress} </h1>
      <h1> ${iterador.telephone} </h1>
      <td> <img src= ${iterador.photo} width=100  alt=""> </td>
      >
      `;
      document.getElementById("misDatos").appendChild(contenedor)

}}

fetch('/user')
  .then(response => {
    return response.json();
  })
  .then(data => {
    for (const iteradorx of data){
      user.push(iteradorx)
    }
  
  render(user)
  
  })
