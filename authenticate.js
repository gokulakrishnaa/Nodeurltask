import express from "express";

const router = express.Router();

router.route("/authenticate").post((request, response) => {
  const { email } = request.body;
  response.send({ email });
});

export const authenticateRouter = router;
