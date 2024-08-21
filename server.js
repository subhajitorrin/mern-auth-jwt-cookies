import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

app.use(express.json())
app.use(cookieParser());

app.use("/", userRouter)

mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to DATABASE");
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    })
}).catch((error) => {
    console.error("Error while connecting mongodb", error);
})