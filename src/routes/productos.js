import express from "express";
import { User } from "../config.js";
import { ensureLoggedIn } from "connect-ensure-login";
import passport from "passport";
import { createTransport } from "nodemailer";
import * as dotenv from "dotenv";
import Contenedor from "../daos/productos/productosDaoFs.js";
import ContenedorMongo from "../daos/productos/productosDaoMongo.js";
import { register, registerpost, login, logout, home, usuario, user, homepost, administrador, productosall, productosid, productospost, productosput, productosdelete } from "./productoscontroller.js";

dotenv.config()

let productosdeMongo = new ContenedorMongo();

const { Router } = express;
const rutaProducto = Router();

const admin = true;

const productos = new Contenedor();

function middleware(peticion, respuesta, next) {
  if (admin == true) {
    next();
  } else {
    respuesta
      .status(403)
      .send({ error: -1, descripcion: "ruta no autorizada" });
  }
}

////////////////////// USANDO ACTUALMENETE ETHEREAL COMO PRUEBA

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'jaydon57@ethereal.email',
      pass: 'TzBtfNxE4PSK8pwgga'
  }
});

const mailOptions={
  from: 'Ecommerce Bentolila CoderHouse',
  to: 'federicobentolila88@gmail.com',
  subject:'Nuevo registro'
}

///////////////////PARA USAR GMAIL///////////////////////


/* const transporter = createTransport({
  service:'gmail',
  port: 587,
  auth: {
      user:'XXXXXXXX@gmail.com',
      pass:'XXXXXXXXXXXXX'
  }
});

const mailOptions={
  from: 'Ecommerce Bentolila CoderHouse',
  to: 'federico_bentolila88@hotmail.com',
  subject:'Nuevo registro'
} */


//////////////////////////////////////////////////

const publicRoot = "./src/public";

//Endpoints

rutaProducto.get("/register", register);

rutaProducto.post("/register", registerpost);

rutaProducto.get("/login", login);

rutaProducto.get("/logout", logout);

rutaProducto.get("/loginerror", (peticion, respuesta) => {
  respuesta.sendFile("loginerror.html", { root: publicRoot });
});

rutaProducto.get(
  "/",
  ensureLoggedIn("/loginerror"),
  home
);

rutaProducto.get(
  "/usuario",
  ensureLoggedIn("/loginerror"),
  usuario
);

rutaProducto.get(
  "/user",
  ensureLoggedIn("/loginerror"),
 user
);

rutaProducto.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/loginerror" }),
  homepost
);


rutaProducto.get("/administrador",middleware, administrador);

rutaProducto.get("/productos", productosall);

rutaProducto.get("/productos/:id", productosid);

rutaProducto.post("/productos", middleware, productospost);

rutaProducto.put("/productos/:id", middleware, productosput);

rutaProducto.delete("/productos/:id", middleware, productosdelete);

export { rutaProducto };
