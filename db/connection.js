import { credentials } from "./credentials.js";
import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${credentials.db_user}:${credentials.db_pass}@cluster.rc1kr.mongodb.net/jwtauth?retryWrites=true&w=majority`
    );
    if (!mongoose) throw new Error();
    console.log("Connection established!");
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
};
