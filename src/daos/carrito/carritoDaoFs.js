import { Contenedor } from "../../contenedor/contenedorFs.js";

class carritoDaoFs extends Contenedor {
  constructor() {
    super("src/db/carritos.json");
  }
}

export default carritoDaoFs;
