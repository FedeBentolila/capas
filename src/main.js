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
import  log4js  from "log4js";
import os from 'os';
import cluster from 'cluster';

const numProcesadores = os.cpus().length;

/////////////////////////log4js
log4js.configure({
  appenders:{
    consolalog:{type:"console"},
    warnlog: {type:'file', filename: 'warn.log'},
    errorlog: {type:'file', filename: 'error.log'},
  },
  categories:{
    default:{appenders:['consolalog'], level:'all'},
    consola:{appenders:['consolalog'], level:'info'},
    warning:{appenders:['warnlog'], level:'warn'},
    error:{appenders:['errorlog'], level:'error'},
  }
})

const loggerConsola= log4js.getLogger('consola')
const loggerWarn= log4js.getLogger('warning')
const loggerError= log4js.getLogger('error')
///////////////////////

if (cluster.isPrimary && process.argv[3]=='CLUSTER') {
  console.log(`Nuevo master: ${process.pid} corriendo, con ${numProcesadores} workers`);

  for (let i = 0 ; i < numProcesadores ; i++) {
    cluster.fork(); 
  }

  cluster.on('exit', (worker) => {
    console.log(`El worker ${worker.process.pid} ha muerto`);
    cluster.fork(); 
  }); 

} else {

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

aplicacion.use((req, res, next) => {
  loggerConsola.info(`${req.method} ${req.url}`);
  next();
});

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

aplicacion.all('*', (req, res) => {
  loggerWarn.warn(`${req.method} ${req.url}`)
  res.status(404).send("No existe esa ruta");
});

}












