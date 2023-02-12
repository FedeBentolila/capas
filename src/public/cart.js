let carrito=[]

function render (data){

  for (const iterador of data) {
      let contenedor = document.createElement("tr");
      contenedor.innerHTML = 
      `  
      <td>${iterador.title}</td>
      <td> ${iterador.price} </td>
      <td> <img src= ${iterador.thumbnail} width=100  alt=""> </td>
      `;
      document.getElementById("carrito").appendChild(contenedor)}}


      fetch('/carritodeluser')
      .then(response => {
        return response.json();
      })
      .then(data => {
        for (const iteradorx of data){
          carrito.push(iteradorx)
        }
      
      render(carrito)
      
      })
