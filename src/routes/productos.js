import express from "express";
import { User } from "../config.js";
import { ensureLoggedIn } from "connect-ensure-login";
import passport from "passport";
import { createTransport } from "nodemailer";
import * as dotenv from "dotenv";
import Contenedor from "../daos/productos/productosDaoFs.js";
import ContenedorMongo from "../daos/productos/productosDaoMongo.js";

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

rutaProducto.get("/register", (peticion, respuesta) => {
  respuesta.sendFile("register.html", { root: publicRoot });
});

rutaProducto.post("/register", (peticion, respuesta) => {
  User.register(
    new User(
      { username: peticion.body.username, 
        telephone:peticion.body.telephone,
        email:peticion.body.email,
        age:peticion.body.age,
        adress:peticion.body.adress,
        photo:peticion.body.photo
      }),
    peticion.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        respuesta.sendFile("registererror.html", { root: publicRoot });
      } else {
        passport.authenticate("local")(peticion, respuesta, () => {

          mailOptions.html= `<h1>${peticion.user.username}</h1><h1>${peticion.user.email}</h1>
          <h1>${peticion.user.telephone}</h1><h1>${peticion.user.adress}</h1>`
          transporter.sendMail(mailOptions)

          respuesta.sendFile("login.html", { root: publicRoot });
        });
      }
    }
  );
});

rutaProducto.get("/login", (peticion, respuesta) => {
  respuesta.sendFile("login.html", { root: publicRoot });
});

rutaProducto.get("/logout", (peticion, respuesta) => {
  peticion.logout((err) => {
    if (err) {
      return next(err);
    }
    respuesta.sendFile("logout.html", { root: publicRoot });
  });
});

rutaProducto.get("/loginerror", (peticion, respuesta) => {
  respuesta.sendFile("loginerror.html", { root: publicRoot });
});



rutaProducto.get(
  "/",
  ensureLoggedIn("/loginerror"),
  (peticion, respuesta) => {
    let nombre = peticion.user.username;
    respuesta.sendFile("inicioconproductos.html", { root: publicRoot });
  }
);

rutaProducto.get(
  "/usuario",
  ensureLoggedIn("/loginerror"),
  (peticion, respuesta) => {
    respuesta.sendFile("usuario.html", { root: publicRoot });
  }
);

rutaProducto.get(
  "/user",
  ensureLoggedIn("/loginerror"),
  (peticion, respuesta) => {
      /* let username = peticion.user.username; */
      let usuario= [
        {username: peticion.user.username,
        telephone :peticion.user.telephone,
         email: peticion.user.email,
         adress: peticion.user.adress,
         photo :peticion.user.photo
        }
      ]
    respuesta.json(usuario)
  }
);

rutaProducto.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/loginerror" }),
  function (peticion, respuesta) {
    let nombre = peticion.user.username;
    respuesta.sendFile("inicioconproductos.html", { root: publicRoot });
  }
);


rutaProducto.get("/administrador",middleware, (peticion, respuesta) => {
  respuesta.render("formulario", {});
});

rutaProducto.get("/productos", (peticion, respuesta) => {
  productosdeMongo.getAllmongo().then((res) => {
    //console.log(res);
    //respuesta.json(res)
  });

  productos.getAll().then((res) => {
    respuesta.json(res);
  });

});

rutaProducto.get("/productos/:id", (peticion, respuesta) => {
  const id = parseInt(peticion.params.id);

  productosdeMongo.getByIDmongo(id).then((res) => {
    console.log(res);
    //respuesta.json(res)
  });

  productos.getByID(id).then((res) => {
    respuesta.json(res);
  });

});

rutaProducto.post("/productos", middleware, (peticion, respuesta) => {
  const producto = peticion.body;

  productosdeMongo.saveMongo(producto).then(() => {
    // respuesta.render("formulario", {});
  });

  productos.Save(producto).then(() => {
    respuesta.render("formulario", {});
  });

});

rutaProducto.put("/productos/:id", middleware, async (peticion, respuesta) => {
  const idProducto = parseInt(peticion.params.id);
  const producto = peticion.body;

  await productos.update(idProducto, producto);

  productosdeMongo.updateMongo(idProducto, producto);

  respuesta.send("ok");
});

rutaProducto.delete("/productos/:id", middleware, (peticion, respuesta) => {
  const id = parseInt(peticion.params.id);

  productosdeMongo.deletemongo(id).then(() => {
    //respuesta.json("producto eliminado");
  });

  productos.deleteById(id).then((res) => {
    respuesta.json("producto eliminado");
  });

});

export { rutaProducto };
