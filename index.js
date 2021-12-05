import express from "express";
import { MongoClient } from "mongodb";
import { userRouter } from "./users.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;

app.get("/", (request, response) => {
  response.send("Hello World !!");
});

app.use("/loginusers", userRouter);

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Connected to Mongodb");
  return client;
}

export const client = await createConnection();

export async function genPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
  return hashedPassword;
}

export async function createUser(data) {
  return await client.db("urlusers").collection("users").insertOne(data);
}

export async function createStatus(data) {
  return await client.db("urlusers").collection("status").insertOne(data);
}

export async function getStatus(data) {
  return await client.db("urlusers").collection("status").find({}).toArray();
}

export async function getAllUsers() {
  return await client.db("urlusers").collection("users").find({}).toArray();
}

export async function getUserByMail(email) {
  return await client
    .db("urlusers")
    .collection("users")
    .findOne({ email: email });
}

app.listen(PORT, () => console.log("App Started in ", PORT));
