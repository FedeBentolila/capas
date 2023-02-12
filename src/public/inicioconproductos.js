let productos=[]

function render (data){

  for (const iterador of data) {
      let contenedor = document.createElement("tr");
      contenedor.innerHTML = 
      `  
      <td>${iterador.title}</td>
      <td> ${iterador.price} </td>
      <td> <img src= ${iterador.thumbnail} width=100  alt=""> </td>
      <td> <button id="button${iterador.id}"> Agregar al Carrito </button> </td>
      `;
      document.getElementById("productos").appendChild(contenedor)


      let product={
        "title": iterador.title,
        "description": iterador.description,
        "price": iterador.price,
        "code": iterador.code,
        "stock": iterador.stock,
        "thumbnail": iterador.thumbnail,
        "id": iterador.id,
        "timestamp": iterador.timestamp

      }

      let boton= document.getElementById("button"+iterador.id);
      boton.onclick=()=>{
        //console.log('agregado'+iterador.title)

        fetch('/agregarproducto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(product)
        });


      }

}}




fetch('/productos')
  .then(response => {
    return response.json();
  })
  .then(data => {
    for (const iteradorx of data){
      productos.push(iteradorx)
    }
  
  render(productos)
  
  })

    

