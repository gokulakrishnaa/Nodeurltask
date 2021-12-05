import express from "express";
import { genPassword, createUser, getUserByMail } from "./index.js";
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

export const userRouter = router;
