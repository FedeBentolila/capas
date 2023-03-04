import * as dotenv from "dotenv";
import Contenedor from "../daos/productos/productosDaoFs.js";
import ContenedorMongo from "../daos/productos/productosDaoMongo.js";
import minimist from "minimist";

dotenv.config()


let productosdeMongo = new ContenedorMongo();

const productos = new Contenedor();

class factory {
    async buscar(base, id){
       if(base=='fs') return productos.getByID(id)
       if(base=='mongo') return productosdeMongo.getByIDmongo(id)
   }

   async agregar(base, objeto){
    if(base=='fs') return productos.Save(objeto)
    if(base=='mongo') return productosdeMongo.saveMongo(objeto)
}
    async borrar(base, id){
    if(base=='fs') return productos.deleteById(id)
    if(base=='mongo') return productosdeMongo.deletemongo(id)
}

}

const factory1= new factory()


async function ejecutarCmds(){
    const argv= minimist(process.argv.slice(2))
    const {cmd, base, title, id, descripcion, price, code, stock, thumbnail}= argv


    if (cmd) {
        try {
            switch (cmd.toLowerCase()) {
                case 'buscar':
                    console.log(cmd)
                    console.log(await factory1.buscar(base, id))
                    break;

                 case 'agregar':
                    console.log(cmd)
                    console.log(await factory1.agregar(base,{title, descripcion, price, code, stock, thumbnail}))
                    break;

                case 'borrar':
                    console.log(cmd)
                    await factory1.borrar(base, id)
                    console.log('producto borrado')
                    break;

               /*   SIN FACTORY
                    case 'buscar':
                    console.log(cmd)
                    console.log(await productos.getByID(id))
                    break;

                case 'agregar':
                    console.log(cmd)
                    console.log(await productos.Save({title, descripcion, price, code, stock, thumbnail}))
                    break;
                
                case 'borrar':
                    console.log(cmd)
                    console.log(await productos.deleteById(id))
                    break;
                    */
            
                default:
                    console.log('comando no valido');
            }
            
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log('cmds no definidos')
    }

   
}

export {ejecutarCmds}



