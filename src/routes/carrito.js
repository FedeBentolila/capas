import express from "express";
import ContenedorCarrito from "../daos/carrito/carritoDaoFs.js";
import ContenedorProductos from "../daos/productos/productosDaoFs.js";
import { ensureLoggedIn } from "connect-ensure-login";
import { User } from "../config.js";
import { createTransport } from "nodemailer";
import twilio from 'twilio'

import ContenedorCarritosMongo from "../daos/carrito/carritoDaoMongo.js";
import ContenedorProductosMongo from "../daos/productos/productosDaoMongo.js";

const rutaCarrito = express.Router();

const publicRoot = "./src/public";

const carritos = new ContenedorCarrito();
const productos = new ContenedorProductos();

let productosdeMongo = new ContenedorProductosMongo();
let carritosdeMongo = new ContenedorCarritosMongo();

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

//////////////////////////////////////////////////Ethereal
  const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jaydon57@ethereal.email',
        pass: 'TzBtfNxE4PSK8pwgga'
    }
  });
  
  const mailOptionsCompra={
    from: 'Ecommerce Bentolila CoderHouse',
    to: 'federicobentolila88@gmail.com',
    subject:'Nueva compra'
  }

//////////////////////////////////////////////Twilio

const accountSid='AC219ff6a83721255a7c97e6e9ad9007d6'
const authToken='449611c02b5ff8a46fa6d07e608adfc3'

const client= twilio(accountSid,authToken)




///////////////////////////////////////////////////////

//Endpoints

rutaCarrito.get("/comprar", async (peticion, respuesta) => {
  let username = peticion.user.username

  const res = await carritosdeMongo.getByUsernamecarritosmongo(username);
  console.log(res[0].productos);

  carritos.getByUsername(username).then((res) => {
    mailOptionsCompra.html= `<h1>Comprador ${peticion.user.username}</h1>
    <h1>Email:${peticion.user.email}</h1>
    <h1>Telefono:${peticion.user.telephone}</h1>
    <h1>Direccion:${peticion.user.adress}</h1>
    <h1>Compra:${JSON.stringify(res.productos)}</h1>`
    
    
    transporter.sendMail(mailOptionsCompra)

     client.messages.create({
      body:'Su orden fue recibida y se encuentra en proceso',
      from:'+19793253183',
      to: `+${peticion.user.telephone}`
    })  

     client.messages.create({
      body:'Nueva Compra',
      from:'whatsapp:+14155238886',
      to: `whatsapp:+5491132272346`
    })  


    respuesta.sendFile("comprarealizada.html", { root: publicRoot });
  });
});

rutaCarrito.get("/carritodeluser", async (peticion, respuesta) => {
  let username = peticion.user.username

  const res = await carritosdeMongo.getByUsernamecarritosmongo(username);
  console.log(res[0].productos);

  carritos.getByUsername(username).then((res) => {
    respuesta.json(res.productos);
  });
});

rutaCarrito.get(
  "/cart",
  ensureLoggedIn("/loginerror"),
  (peticion, respuesta) => {
    respuesta.sendFile("cart.html", { root: publicRoot });
  }
);

rutaCarrito.post(
  "/agregarproducto", async (peticion, respuesta) => {
    
    let carrito={
      productos: [peticion.body],
      username: peticion.user.username,
    }

    let userabuscar= await carritos.getByUsername(peticion.user.username)

    if (userabuscar) {

      productos.getByID(peticion.body.id).then((res) => {
        carritos.getByUsername(peticion.user.username).then((res2) => {
          res2.productos.push(res);
          carritos.updateByUserName(peticion.user.username, res2);
        });
      });


      productosdeMongo.getByIDmongo(peticion.body.id).then((res) => {
        carritosdeMongo.getByUsernamecarritosmongo(peticion.user.username).then((res2) => {
          res2[0].productos.push(res[0]);
  
          carritosdeMongo.updateMongoCarritosByUsername(peticion.user.username, res2[0].productos);
        });
      });

      
      
    } else {
      carritos.Save(carrito);
      carritosdeMongo.saveMongoCarrito(carrito)
    }

  }
);


rutaCarrito.get("/carrito", async (peticion, respuesta) => {
  const listacarritomongo = await carritosdeMongo.getAllcarritosMongo();
  console.log(listacarritomongo);

  const listaCarritos = await carritos.getAll();
  respuesta.json(listaCarritos);

});

rutaCarrito.delete("/carrito/:id", async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  await carritos.deleteById(idCarrito);

  await carritosdeMongo.deletecarritosmongo(idCarrito);
  respuesta.json({
    status: "ok",
  });
});

rutaCarrito.get("/carrito/:id/productos", async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);

  const res = await carritosdeMongo.getByIDcarritosmongo(idCarrito);
  console.log(res[0].productos);

  carritos.getByID(idCarrito).then((res) => {
    respuesta.json(res.productos);
  });
});

rutaCarrito.post("/carrito", async (peticion, respuesta) => {
  const carrito = {
    productos: [],
  };

  carritosdeMongo.saveMongoCarrito(carrito);

  carritos.Save(carrito).then((res) => {
    respuesta.json(res);
  });
});

rutaCarrito.post(
  "/carrito/:id/productos/:id_prod",
  async (peticion, respuesta) => {
    const idCarrito = parseInt(peticion.params.id);
    const idProducto = parseInt(peticion.params.id_prod);

    productosdeMongo.getByIDmongo(idProducto).then((res) => {
      carritosdeMongo.getByIDcarritosmongo(idCarrito).then((res2) => {
        res2[0].productos.push(res[0]);

        carritosdeMongo.updateMongoCarritos(idCarrito, res2[0].productos);
      });
    });

    productos.getByID(idProducto).then((res) => {
      carritos.getByID(idCarrito).then((res2) => {
        res2.productos.push(res);
        carritos.update(idCarrito, res2);
      });
    });

    respuesta.json({
      status: "ok",
    });
  }
);

rutaCarrito.delete(
  "/carrito/:id/productos/:id_prod",
  async (peticion, respuesta) => {
    const idCarrito = parseInt(peticion.params.id);
    const idProducto = parseInt(peticion.params.id_prod);

    await carritosdeMongo.deleteproductosdecarrito(idCarrito, idProducto);

    const carrito = await carritos.getByID(idCarrito);
    let indexToDelete = -1;
    carrito.productos.forEach((producto, index) => {
      if (producto.id == idProducto) {
        indexToDelete = index;
      }
    });
    if ((indexToDelete) => 0) {
      carrito.productos.splice(indexToDelete, 1);
    }
    await carritos.update(idCarrito, carrito);
    respuesta.json({
      status: "ok",
    });
  }
);

export { rutaCarrito };
