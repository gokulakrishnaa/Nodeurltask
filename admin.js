import express from "express";
import {
  createTeacher,
  getTeacherByMail,
  createStudent,
  getStudentByMail,
  getAdminByMail,
  createAdmin,
} from "./helper.js";
import { genPassword } from "./index.js";
import bcrypt from "bcrypt";

const router = express.Router();

//Create Admin Account
router.route("/createadmin").post(async (request, response) => {
  const { email, password } = request.body;
  const adminFromDB = await getAdminByMail(email);
  if (adminFromDB) {
    response.status(400).send({ message: "Email already registered" });
    return;
  }

  if (password.length < 8) {
    response.status(400).send({ message: "Password must be longer" });
    return;
  }

  const hashedPassword = await genPassword(password);
  const result = await createAdmin({
    email,
    password: hashedPassword,
  });
  response.send(result);
});

//Admin Login
router.route("/adminlogin").post(async (request, response) => {
  const { email, password } = request.body;
  const adminFromDB = await getAdminByMail(email);
  if (!adminFromDB) {
    response.status(400).send({ message: "Invalid Credentials" });
    return;
  }

  if (password.length < 8) {
    response.status(401).send({ message: "Password must be longer" });
    return;
  }

  const storedPassword = adminFromDB.password;
  const isPasswordMatch = await bcrypt.compare(password, storedPassword);
  if (isPasswordMatch) {
    response.status(200).send({ message: "Login Successful" });
  } else {
    response.status(401).send({ message: "Invalid Credentials" });
  }
});

//Create Teacher Account
router.route("/createteacher").post(async (request, response) => {
  const { tId, name, email, password, city, phNo } = request.body;
  const teacherFromDB = await getTeacherByMail(email);
  if (teacherFromDB) {
    response.status(400).send({ message: "Email already registered" });
    return;
  }

  if (password.length < 8) {
    response.status(400).send({ message: "Password must be longer" });
    return;
  }

  const hashedPassword = await genPassword(password);
  const result = await createTeacher({
    tId,
    name,
    email,
    password: hashedPassword,
    city,
    phNo,
  });
  response.send({ message: "Teacher added" });
});

//Teacher Login
router.route("/teacherlogin").post(async (request, response) => {
  const { email, password } = request.body;
  const teacherFromDB = await getTeacherByMail(email);
  if (!teacherFromDB) {
    response.status(400).send({ message: "Invalid Credentials" });
    return;
  }

  if (password.length < 8) {
    response.status(401).send({ message: "Password must be longer" });
    return;
  }

  const storedPassword = teacherFromDB.password;
  const isPasswordMatch = await bcrypt.compare(password, storedPassword);
  if (isPasswordMatch) {
    response.status(200).send({ message: "Login Successful" });
  } else {
    response.status(401).send({ message: "Invalid Credentials" });
  }
});

//Create Student Account
router.route("/createstudent").post(async (request, response) => {
  const { sId, name, gender, email, password, year, attendance } = request.body;
  const studentFromDB = await getStudentByMail(email);
  if (studentFromDB) {
    response.status(400).send({ message: "Email already registered" });
    return;
  }

  if (password.length < 8) {
    response.status(400).send({ message: "Password must be longer" });
    return;
  }

  const hashedPassword = await genPassword(password);
  const result = await createStudent({
    sId,
    name,
    gender,
    email,
    password: hashedPassword,
    year,
    attendance,
  });
  response.send({ message: "Student added" });
});

//Student Login
router.route("/studentlogin").post(async (request, response) => {
  const { email, password } = request.body;
  const studentFromDB = await getStudentByMail(email);
  if (!studentFromDB) {
    response.status(400).send({ message: "Invalid Credentials" });
    return;
  }

  if (password.length < 8) {
    response.status(401).send({ message: "Password must be longer" });
    return;
  }

  const storedPassword = studentFromDB.password;
  const isPasswordMatch = await bcrypt.compare(password, storedPassword);
  if (isPasswordMatch) {
    response.status(200).send({ message: "Login Successful", email });
  } else {
    response.status(401).send({ message: "Invalid Credentials" });
  }
});

export const adminRouter = router;
