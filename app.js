import express from "express";
import { dbConnect } from "./db/connection.js";

const app = express();
app.use(express.json());
const PORT = 4000;

import userRoute from "./routes/userRoute.js";

app.get("/", async (req, res) => {
  res.status(200).json({ msg: "API running..." });
});

app.use("/users", userRoute);

await dbConnect();

//Models

app.listen(PORT, () => console.log(`working on port ${PORT}`));
