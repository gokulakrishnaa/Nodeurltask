import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.route("/authenticate").post((request, response) => {
  const { email } = request.body;

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
    html: `<h1>Hello from App</h1>`,
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

export const authenticateRouter = router;
