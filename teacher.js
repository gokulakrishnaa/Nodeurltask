import express from "express";
import { getAllStudents, updateAttendance } from "./helper.js";

const router = express.Router();

// Get Students Details
router.route("/getallstudents").get(async (request, response) => {
  const result = await getAllStudents();
  response.status(200).send(result);
});

// Update Attendance Percentage
router.route("/updatestatus").put(async (request, response) => {
  const { sId, attendance } = request.body;
  const update = await updateAttendance(sId, attendance);
  response.status(200).send({ message: "Updated" });
});

export const teacherRouter = router;
