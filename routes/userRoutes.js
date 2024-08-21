import express from "express";
import { loginUser, registerUser, getAllUsers } from "../controllers/UserController.js";
import authToken from "../middlewares/authToken.js"
const userRouter = express.Router()
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/getallusers", authToken, getAllUsers)
export default userRouter