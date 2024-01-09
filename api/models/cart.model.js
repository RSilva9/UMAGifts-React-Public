import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: String,
    boxes: {
        type: [
            {
                box:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "boxes"
                },
                quantity: Number
            }
        ]
    },
    customBoxes: [{
        products: {
            estuche: String,
            botellas: [
                {
                    nombre: String
                }
            ],
            delis: [
                {
                    nombre: String
                }
            ],
            precio: Number,
            id: String
        },
        quantity: Number
    }],
    relaxBoxes: [{
        products: {
            jabon: String,
            vela: String,
            sales: String,
            homeSpray: String,
            esponja: String
        },
        precio: Number,
        quantity: Number
    }],
    totalPrice: Number
})

cartSchema.pre('findOne', function() {
    this.populate({
        path: 'boxes.box',
        populate: {
            path: 'content.product'
        }
    });
});

export const cartModel = mongoose.model(cartCollection, cartSchema);