import Contenedor from "../daos/productos/productosDaoFs.js";
import ContenedorMongo from "../daos/productos/productosDaoMongo.js";

let productosdeMongo = new ContenedorMongo();
const productos = new Contenedor();


async function getProducto({id}){
    /* return productosdeMongo.getByIDmongo(id)*/
    
     return productos.getByID(id)
  }
  
async function getProductos(){
   /*  return productosdeMongo.getAllmongo() */

    return productos.getAll()
  }
  
async function createProducto(producto){
    productosdeMongo.saveMongo(producto.datos).then(() => {
        console.log('producto creado en mongo')
      });
    
      productos.Save(producto.datos).then(() => {
        return producto.datos
      });
  }
  
async function deleteProducto({id}){
    productosdeMongo.deletemongo(id).then(() => {
        console.log('producto eliminado de mongo')
      });
    
      productos.deleteById(id).then((res) => {
        console.log('producto eliminado de fs');
      });
  }

async function updateProducto({id, datos}){
  console.log(datos)
  productosdeMongo.updateMongo(id, datos)

  productos.update(id, datos)

}

export{ getProducto,getProductos, createProducto, deleteProducto, updateProducto}