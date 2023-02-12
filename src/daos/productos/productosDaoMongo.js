import { ContenedorMongo } from "../../contenedor/contenedorMongo.js";

class productosDaoMongo extends ContenedorMongo {
  constructor() {
    super("productos");
  }
}

export default productosDaoMongo;
