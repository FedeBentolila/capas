import { Contenedor } from "../../contenedor/contenedorFs.js";

class productosDaoFs extends Contenedor {
  constructor() {
    super("src/db/productos.json");
  }
}

export default productosDaoFs;
