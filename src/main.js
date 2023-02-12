import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
import { User } from "./config.js";
import { rutaProducto } from "./routes/productos.js";
import { rutaCarrito } from "./routes/carrito.js";
import { ConexionMongo } from "./config.js";

ConexionMongo();

const aplicacion = express();

const PORT = process.argv[2] || 8080;

aplicacion.set("view engine", "ejs");

aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

aplicacion.use(cookieParser());
aplicacion.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://root:root@cluster0.wsvmh2e.mongodb.net/sesiones?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
    }),
    secret: "Secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);
aplicacion.use(bodyParser.urlencoded({ extended: true }));
aplicacion.use(passport.initialize());
aplicacion.use(passport.session()); 
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const publicRoot = "./src/public";

aplicacion.use(express.static(publicRoot));

aplicacion.use("/", rutaProducto);
aplicacion.use("/", rutaCarrito);


const conexionServidor = aplicacion.listen(PORT, () => {
  console.log(
    `Aplicación escuchando en el puerto: ${conexionServidor.address().port}`
  );
});

conexionServidor.on("error", (error) =>
  console.log(`Ha ocurrido un error: ${error}`)
);



