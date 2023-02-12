import * as fs from "fs";

let date = new Date();
let dateStr =
  ("00" + date.getDate()).slice(-2) +
  "/" +
  ("00" + (date.getMonth() + 1)).slice(-2) +
  "/" +
  date.getFullYear() +
  " " +
  ("00" + date.getHours()).slice(-2) +
  ":" +
  ("00" + date.getMinutes()).slice(-2) +
  ":" +
  ("00" + date.getSeconds()).slice(-2);

export class Contenedor {
  constructor(nombre) {
    this.nombre = nombre;
  }

  async getAll() {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    return archivoParseado;
  }

  async getByID(idabuscar) {
    try {
      const archivo = await fs.promises.readFile(this.nombre, "utf-8");
      const archivoParseado = JSON.parse(archivo);
      let objetobuscado;
      if ((objetobuscado = archivoParseado.find(({ id }) => id == idabuscar))) {
        return objetobuscado;
      } else {
        console.log(null);
      }
    } catch (error) {
      console.log("error al buscar el id");
    }
  }

  /////////////////////////////////////////////////////

  async getByUsername(usernameabuscar) {
    try {
      const archivo = await fs.promises.readFile(this.nombre, "utf-8");
      const archivoParseado = JSON.parse(archivo);
      let objetobuscado;
      if ((objetobuscado = archivoParseado.find(({ username }) => username == usernameabuscar))) {
        return objetobuscado;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error al buscar el username");
    }
  }




  ////////////////////////////////////////////////////

  async Save(objeto) {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    let id = 1;
    archivoParseado.forEach((element, index) => {
      if (element.id >= id) {
        id = element.id + 1;
      }
    });
    objeto.id = id;
    objeto.timestamp = dateStr;
    archivoParseado.push(objeto);
    await fs.promises.writeFile(
      this.nombre,
      JSON.stringify(archivoParseado, null, 2)
    );
    return id;
  }

  async update(id, objeto) {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    let posicion = -1;
    archivoParseado.forEach((producto, indice) => {
      if (producto.id == id) {
        posicion = indice;
      }
    });
    objeto.id = id;
    objeto.timestamp = dateStr;
    if ((posicion) => 0) {
      archivoParseado[posicion] = objeto;
      await fs.promises.writeFile(
        this.nombre,
        JSON.stringify(archivoParseado, null, 2)
      );
      return objeto.id;
    }
  }



  async updateByUserName(username, objeto) {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    let posicion = -1;
    archivoParseado.forEach((producto, indice) => {
      if (producto.username == username) {
        posicion = indice;
      }
    });
    objeto.timestamp = dateStr;
    if ((posicion) => 0) {
      archivoParseado[posicion] = objeto;
      await fs.promises.writeFile(
        this.nombre,
        JSON.stringify(archivoParseado, null, 2)
      );
      return objeto.username;
    }
  }
  

  async deleteById(id) {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    let indexSeleccionado = -1;
    archivoParseado.forEach((element, index) => {
      if (element.id == id) {
        indexSeleccionado = index;
      }
    });
    if (indexSeleccionado != -1) {
      archivoParseado.splice(indexSeleccionado, 1);
      await fs.promises.writeFile(
        this.nombre,
        JSON.stringify(archivoParseado, null, 2)
      );
    }
  }

  async deleteAll() {
    const arregloVacio = [];
    await fs.promises.writeFile(
      this.nombre,
      JSON.stringify(arregloVacio, null, 2)
    );
  }
}
