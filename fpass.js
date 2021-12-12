import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getUserByMail, getUserById, updatePassword } from "./index.js";

const router = express.Router();

router.route("/forgot-password").post(async (req, res) => {
  const { email } = req.body;
  const userFromDB = await getUserByMail(email);
  console.log(userFromDB);
  if (userFromDB) {
    const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_MAIL,
      to: `${email}`,
      subject: "Hello from Node App",
      html: `Click <a href="https://localhost:3000/resetpassword/${userFromDB._id}/${token}">here</a> for resetting your password`,
    };

    transport.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Mail Sent");
      }
    });
  } else {
    res.send({ message: "Email Id not found" });
  }
});

router.route("/reset-password/:id/:token").post(async (req, res) => {
  const { token, id } = req.params;
  const { newPass } = req.body;
  const userFromDB = await getUserById(id);
  console.log(userFromDB);
  if (JSON.stringify(id) !== JSON.stringify(userFromDB._id)) {
    res.send("Invalid Id...");
    return;
  } else {
    jwt.verify(token, process.env.SECRET_KEY);
    const hashedPassword = await genPassword(newPass);
    const result = await updatePassword({ id, password: hashedPassword });
    res.send(result);
  }
});

export const fpassRouter = router;
