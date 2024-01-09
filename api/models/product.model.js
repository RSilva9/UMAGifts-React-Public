import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    nombre: String,
    codigo: Number,
    img: String,
    tipo: String,
    size: Number,
    precio: Number
})

export const productModel = mongoose.model(productCollection, productSchema);