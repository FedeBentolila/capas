import express from "express";
import ContenedorCarrito from "../daos/carrito/carritoDaoFs.js";
import ContenedorProductos from "../daos/productos/productosDaoFs.js";
import { ensureLoggedIn } from "connect-ensure-login";
import { User } from "../config.js";
import { createTransport } from "nodemailer";
import twilio from 'twilio'
import * as dotenv from "dotenv";

import ContenedorCarritosMongo from "../daos/carrito/carritoDaoMongo.js";
import ContenedorProductosMongo from "../daos/productos/productosDaoMongo.js";
import { agregarproducto, carrito, carritoidprodid, carritoidproductos, carritopost, cart, comprar, deletecarritoidprodid } from "./carritocontroller.js";

dotenv.config()

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

const accountSid= process.env.CLAVETWILIOSID
const authToken=process.env.CLAVETWILIOTOKEN

const client= twilio(accountSid,authToken)


///////////////////////////////////////////////////////

//Endpoints

rutaCarrito.get("/comprar", comprar);

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
  cart
);

rutaCarrito.post(
  "/agregarproducto", agregarproducto
);


rutaCarrito.get("/carrito", carrito);

rutaCarrito.get("/carrito/:id/productos", carritoidproductos);

rutaCarrito.post("/carrito", carritopost);

rutaCarrito.post(
  "/carrito/:id/productos/:id_prod",
  carritoidprodid
);

rutaCarrito.delete(
  "/carrito/:id/productos/:id_prod",
  deletecarritoidprodid
);

export { rutaCarrito };
