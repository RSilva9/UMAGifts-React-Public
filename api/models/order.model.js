import mongoose from "mongoose";

const orderCollection = 'orders'

const orderSchema = new mongoose.Schema({
    user: {
        name: String,
        email: String,
    },
    envio: String,
    content: {
        type: Object
    },
    finished: Boolean,
    date: Object
})

export const orderModel = mongoose.model(orderCollection, orderSchema);