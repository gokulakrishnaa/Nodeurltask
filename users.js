import express from "express";
import {
  genPassword,
  createUser,
  createStatus,
  getStatus,
  getUserByMail,
  getAllUsers,
} from "./index.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.route("/signup").post(async (request, response) => {
  const { email, firstname, lastname, password } = request.body;
  const userFromDB = await getUserByMail(email);
  if (userFromDB) {
    response.status(400).send({ message: "Email already registered" });
    return;
  }

  if (password.length < 8) {
    response.status(400).send({ message: "Password must be longer" });
    return;
  }

  const hashedPassword = await genPassword(password);
  const result = await createUser({
    email,
    firstname,
    lastname,
    password: hashedPassword,
  });
  response.send(result);
});

router.route("/signup").get(async (request, response) => {
  const data = await getAllUsers();
  response.send(data);
});

router.route("/login").post(async (request, response) => {
  const { email, password } = request.body;
  const userFromDB = await getUserByMail(email);
  if (!userFromDB) {
    response.status(400).send({ message: "Invalid Credentials" });
    return;
  }

  if (password.length < 8) {
    response.status(401).send({ message: "Password must be longer" });
    return;
  }

  const storedPassword = userFromDB.password;
  const isPasswordMatch = await bcrypt.compare(password, storedPassword);
  if (isPasswordMatch) {
    const result = await createStatus({ current_status: "Logged In" });
    response.send({ message: "Login Successful", result });
  } else {
    response.status(401).send({ message: "Invalid Credentials" });
  }
});

router.route("/login").get(async (request, response) => {
  const data = await getStatus();
  response.send({ message: "Welcome to Login Page", data });
});

export const userRouter = router;
