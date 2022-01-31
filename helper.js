import { client } from "./index.js";

export async function createTeacher(data) {
  return await client.db("attendance").collection("teacher").insertOne(data);
}

export async function getTeacherByMail(email) {
  return await client
    .db("attendance")
    .collection("teacher")
    .findOne({ email: email });
}

export async function createStudent(data) {
  return await client.db("attendance").collection("student").insertOne(data);
}

export async function getStudentByMail(email) {
  return await client
    .db("attendance")
    .collection("student")
    .findOne({ email: email });
}

export async function createAdmin(data) {
  return await client.db("attendance").collection("admin").insertOne(data);
}

export async function getAdminByMail(email) {
  return await client
    .db("attendance")
    .collection("admin")
    .findOne({ email: email });
}

export async function getAllStudents() {
  return await client.db("attendance").collection("student").find().toArray();
}

export async function getStudent(email) {
  return await client
    .db("attendance")
    .collection("student")
    .findOne({ email: email });
}

export async function updateAttendance(sId, attendance) {
  return await client
    .db("attendance")
    .collection("student")
    .updateOne({ sId: sId }, { $set: { attendance: attendance } });
}
