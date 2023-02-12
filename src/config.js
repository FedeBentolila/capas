import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const productosCollection = "productos";
const Schema = mongoose.Schema;

const productosSchema = new Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  code: { type: Number },
  stock: { type: Number },
  thumbnail: { type: String },
  timestamp: { type: String },
  id: { type: Number },
});

const carritosCollection = "carritos";
const carritosSchema = new Schema({
  id: { type: Number },
  timestamp: { type: String },
  username: { type: String },
  productos: { type: Array },
});

export const carritosmodule = mongoose.model(
  carritosCollection,
  carritosSchema
);
export const productosmodule = mongoose.model(
  productosCollection,
  productosSchema
);

export async function ConexionMongo() {
  mongoose.connect(
    "mongodb+srv://root:root@cluster0.wsvmh2e.mongodb.net/ecommerce?retryWrites=true&w=majority",
    {
      useNewUrlparser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("ok conexion");
}

const usersCollection= 'users';
const Schemauser= mongoose.Schema
const UserSchema= new Schemauser({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    telephone: {type: Number},
    age: {type: Number},
    adress: {type: String},
    photo: {type: String}
});

UserSchema.plugin(passportLocalMongoose);

export const User= mongoose.model(
    usersCollection,
    UserSchema
);
