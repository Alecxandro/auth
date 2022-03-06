import { User } from "../models/User.js";
import express from "express";
import * as bcrypt from "bcrypt";
import { credentials } from "../db/credentials.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Create a new user
router.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmPassword } = await req.body;
  if (!name || !email || !password) {
    res.status(422).json({ msg: "All fields are required!" });
  }

  if (password !== confirmPassword) {
    res.status(422).json({ msg: "Password don't match!" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res
      .status(403)
      .json({ msg: "This email has already been registered!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await newUser.save();
    res.status(201).json({ msg: "User saved successfully!" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

//Authenticate user
router.post("/auth/user", async (req, res) => {
  const { email, password } = await req.body;

  if (!email || !password) {
    res.status(422).json({ msg: "Invalid email or password!" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({ msg: "email not found!" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(404).json({ msg: "password incorrect!" });
  }

  try {
    const secret = credentials.secret;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "user authenticated", token });
  } catch (error) {}
});

//Private route
router.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) res.status(404).json({ msg: "User not found" });

  res.status(200).json({ user });
});

async function checkToken(req, res, next) {
  const authHeader = await req.headers["authorization"];
  const token = (await authHeader) && authHeader.split(" ")[1];

  if (!token) res.status(404).json({ msg: "Access denied!" });

  try {
    const secret = credentials.secret;
    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(404).json({ msg: "Invalid token" });
  }
}

export default router;
