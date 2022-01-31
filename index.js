import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { userRouter } from "./users.js";
import { authenticateRouter } from "./authenticate.js";
import { fpassRouter } from "./fpass.js";
import { urlShortRouter } from "./urlshort.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cors from "cors";
import { adminRouter } from "./admin.js";
import { teacherRouter } from "./teacher.js";
import {studentRouter} from "./student.js"

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
app.use("/verifyuser", authenticateRouter);
app.use("/fpass", fpassRouter);
app.use("/urlshort", urlShortRouter);
app.use("/api/admin", adminRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/student", studentRouter)

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
  return await client
    .db("urlusers")
    .collection("users")
    .find({}, { projection: { email: 1, firstname: 1 } })
    .toArray();
}

export async function getUserByMail(email) {
  return await client
    .db("urlusers")
    .collection("users")
    .findOne({ email: email });
}

export async function getUserById(id) {
  return await client
    .db("urlusers")
    .collection("users")
    .findOne({ _id: ObjectId(id) });
}

export async function updatePassword(id, password) {
  console.log(password);
  return await client
    .db("urlusers")
    .collection("users")
    .updateOne({ _id: ObjectId(id) }, { $set: { password: password } });
}

export async function createUrl(url, shortId) {
  return await client
    .db("urlusers")
    .collection("url")
    .insertOne({ url: url, shortId: shortId });
}

export async function getShortUrl(url) {
  return await client.db("urlusers").collection("url").findOne({ url: url });
}

export async function getUrl(shortId) {
  return await client
    .db("urlusers")
    .collection("url")
    .findOne({ shortId: shortId });
}

app.listen(PORT, () => console.log("App Started in ", PORT));
