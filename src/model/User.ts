import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile_number:{ type: Number, required: true, },
})

export const User = mongoose.model("User",userSchema);


