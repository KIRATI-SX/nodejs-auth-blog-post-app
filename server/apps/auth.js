import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
// โค้ดนี้อยู่ในไฟล์ server/apps/auth.js
authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  // เข้ารหัสรหัสผ่านก่อนเก็บลงฐานข้อมูล
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const collection = db.collection("users");
  await collection.insertOne(user);

  return res.json({
    message: "User has been created successfully",
  });
});
// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const user = await db.collection("users").findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(404).json({
      message: "Invalid username or password",
    });
  }
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    // id คือ user id
    // firstName คือ Firstname ของ User
    // lastName คือ Lastname ของ User
    { id: user._id, firstName: user.firstName, lastName: user.lastName },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
  );

  return res.json({
    message: "Login successful",
    token,
  });
});

export default authRouter;
