import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const router = express.Router();

router.route("/authenticate").post((request, response) => {
  const { email } = request.body;

  const token = jwt.sign({ email: email }, process.env.SECRET_KEY);

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
    html: `Click <a href="http://localhost:3000/activateuser/${token}">here</a> to confirm your registration`,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      response.send(err);
    } else {
      response.send("Mail Sent");
    }
  });
});

// router.route("/activateuser/:token").get(async (req, res) => {
//   const token = req.params;
//   res.send({ message: "Activated" });
// });

export const authenticateRouter = router;
