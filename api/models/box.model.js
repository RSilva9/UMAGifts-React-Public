import mongoose from "mongoose";

const boxCollection = 'boxes'

const boxSchema = new mongoose.Schema({
    codigo: Number,
    content: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }
            }
        ]
    },
    img: String,
    imgbg: String,
    tipo: String,
    tam: String,
    deli: Boolean,
    precio: Number
})

boxSchema.pre('findOne', function(){
    this.populate('content.product')
})

export const boxModel = mongoose.model(boxCollection, boxSchema);