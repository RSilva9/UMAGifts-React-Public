import { boxModel } from "../models/box.model.js";
import { productModel } from "../models/product.model.js";

class BoxManager{
    constructor(model){
        this.boxModel = model
    }

    updateBoxPrice = async()=>{
        try {
            const boxes = await boxModel.find({}).populate('content.product')
            for(let box of boxes){
                let precioTotal = 0
                for(let item of box.content){
                    precioTotal += item.product.precio
                }
                await boxModel.updateOne({ codigo: box.codigo } ,{
                    precio: precioTotal
                })
            }
        } catch (error) {
            return new Error(error)
        }
    }

    getBoxes = async()=>{
        try {
            const boxes = await boxModel.find({}).sort({ codigo: 1 });
            return boxes
        } catch (error) {
            return new Error(error)
        }
    }

    getBoxById = async(bid)=>{
        try {
            const box = await boxModel.findOne({codigo: bid}).exec()
            return box
        } catch (error) {
            return new Error(error)
        }
    }

    getFilteredBox = async(query)=>{
        try {
            const boxes = await boxModel.find(query).sort({ codigo: 1 })
            return boxes
        } catch (error) {
            return new Error(error)
        }
    }
}

export const boxManager = new BoxManager()