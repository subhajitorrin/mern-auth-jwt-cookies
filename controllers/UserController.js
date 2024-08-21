import bcrypt from "bcryptjs/dist/bcrypt.js";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

async function registerUser(req, res) {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res
                .status(400)
                .json({
                    msg: "Please provide both username and password",
                    success: false,
                });
        }
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res
                .status(400)
                .json({ msg: "User already exist", success: false });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
            username,
            password: hashedPassword,
        });
        const response = await newUser.save();
        res
            .status(201)
            .json({
                msg: "User created successfully",
                user: response,
                success: true,
            });
    } catch (error) {
        console.error("Error while creating user", error);
        res.status(500).json({ msg: "Error while creating user", success: false });
    }
}

async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res
                .status(400)
                .json({
                    msg: "Please provide both username and password",
                    success: false,
                });
        }
        const existingUser = await UserModel.findOne({ username });
        if (!existingUser) {
            return res
                .status(400)
                .json({ msg: "User doesn't exist, register now", success: false });
        }
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            return res
                .status(400)
                .json({ msg: "Incorrect password", success: false });
        }
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_KEY, { expiresIn: '1m' })
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 100,
            sameSite: "Strict"
        })
        return res.status(200).json({
            msg: "Login successful",
            success: true,
        });
    } catch (error) {
        console.error("Error while logging user", error);
        res.status(500).json({ msg: "Error while creating user", success: false });
    }
}

async function getAllUsers(req, res) {
    const userId = req.userId
    try {
        const allUsers = await UserModel.find({ _id: { $ne: userId } }, '-password');
        return res.status(200).json({ msg: "All Users fetched", allUsers, success: true })
    } catch (error) {
        console.error("Error while fetching all users", error);
        res.status(500).json({ msg: "Error while fetching all users", success: false });
    }
}

export { registerUser, loginUser, getAllUsers };
