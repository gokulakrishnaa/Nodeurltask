import express from "express";
import { getStudent } from "./helper.js";

const router = express.Router();

// Get a Student Details
router.route("/getstudent/:email").get(async (request, response) => {
  const { email } = request.params;
  const result = await getStudent(email);
  response.status(200).send(result);
});

export const studentRouter = router;
