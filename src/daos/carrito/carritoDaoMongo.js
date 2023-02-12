import { ContenedorMongo } from "../../contenedor/contenedorMongo.js";

class carritosDaoMongo extends ContenedorMongo {
  constructor() {
    super("carritos");
  }
}

export default carritosDaoMongo;
