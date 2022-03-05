import express from "express";
import { dbConnect } from "./db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/", async (req, res) => {
  res.status(200).json({ msg: "API running..." });
});

app.post("/auth/register", async (req,res) => {
    const {name, email, password, confirmPassword} = await req.body;
    if (!name) res.status(422).json({msg: "name is mandatory!"})

})


await dbConnect();

app.listen(PORT, () => console.log(`working on port ${PORT}`));
