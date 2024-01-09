import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const userCollection = 'usuarios'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    cartId: String,
    newsletter: String,
    role: String
})

userSchema.pre('findOne', function(){
    this.populate('cartId')
})

export const userModel = mongoose.model(userCollection, userSchema);