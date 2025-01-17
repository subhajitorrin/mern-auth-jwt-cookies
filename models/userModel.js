import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String, require: true
    }
})
const UserModel = mongoose.model("User", userSchema)
export default UserModel