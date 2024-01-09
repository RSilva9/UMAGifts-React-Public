import { boxModel } from '../models/box.model.js'
import { cartModel } from '../models/cart.model.js'
import { productModel } from '../models/product.model.js'
import Randomstring from 'randomstring'
import { boxManager } from './BoxManager.js'
import { productManager } from './ProductManager.js'

class CartManager{
    constructor(model){
        this.model = cartModel
    }

    createCart = async()=>{
        try {
            const newCart = {
                id: Randomstring.generate(8),
                totalPrice: 0
            }
            return await this.model.create(newCart)
        } catch (error) {
            return new Error(error)
        }
    }

    getCartById = async(cid)=>{
        try {
            return await cartModel.findOne({ id: cid }).exec()
        } catch (error) {
            return new Error(error)
        }
    }

    addBoxToCart = async(cid, pid, count)=>{
        try{
            const cart = await this.model.findOne({id: cid}).lean()
            let product = await boxModel.findOne({codigo: pid}).lean()
            let string1, string2
            if(cart.boxes.length > 0){
                for(let item of cart.boxes){
                    string1 = `${item.box}`
                    string2 = `${product._id}`
                    if (string1 === string2){
                        item.quantity += Number(count)
                        cart.totalPrice += Number(product.precio)*count
                        return await this.model.findOneAndUpdate({id: cid}, cart) 
                    }
                }
                cart.totalPrice += Number(product.precio)*count
                cart.boxes.push({box: product._id, quantity: count})
            }else{
                cart.totalPrice += Number(product.precio)*count
                cart.boxes.push({box: product._id, quantity: count})
            }
            return await this.model.findOneAndUpdate({id: cid}, cart)  
        }catch(err){
            return new Error(err)
        }
    }

    addCustomBoxToCart = async(customBox, count, cid)=>{
        try {
            const cart = await this.model.findOne({id: cid}).lean()
            const arrayBotellas = []
            const arrayDelis = []
            for(let item of customBox.botellas){
                arrayBotellas.push(item)
            }
            for(let item of customBox.delis){
                arrayDelis.push(item)
            }
            const newCustomBox = {
                "estuche": customBox.estuche,
                "botellas": arrayBotellas,
                "delis": arrayDelis,
                "precio": customBox.precio,
                "id": customBox.id
            }
            cart.customBoxes.push({
                products: newCustomBox,
                quantity: count
            })
            cart.totalPrice += Number(customBox.precio)*count
            return await this.model.findOneAndUpdate({id: cid}, cart)
        } catch (error) {
            return new Error(error)
        }
    }

    addRelaxBoxToCart = async(relaxBox, count, cid)=>{
        try {
            const cart = await this.model.findOne({id: cid}).lean()
            console.log(relaxBox.finished, count)
            if(!cart.relaxBoxes){
                const relaxBoxes = []
                relaxBoxes.push({
                    products: relaxBox.finished,
                    precio: relaxBox.precio,
                    quantity: count
                })
                cart.relaxBoxes = relaxBoxes
                cart.totalPrice += Number(relaxBox.precio)*count
            }else{
                cart.relaxBoxes.push({
                    products: relaxBox.finished,
                    precio: relaxBox.precio,
                    quantity: count
                })
                cart.totalPrice += Number(relaxBox.precio)*count
            }
            return await this.model.findOneAndUpdate({id: cid}, cart)
        } catch (error) {
            return new Error(error)
        }
    }

    removeFromCart = async(itemId, cid)=>{
        try {
            const cart = await this.model.findOne({id: cid}).populate('boxes.box')
            for(let item of cart.boxes){
                if(item._id == itemId){
                    const index = cart.boxes.indexOf(item)
                    if (index !== -1) {
                        cart.boxes.splice(index, 1)
                        cart.totalPrice -= item.box.precio*item.quantity
                        await this.model.updateOne({id: cid}, cart)
                        return cart
                    }
                }
            }
            for(let item of cart.customBoxes){
                if(item._id == itemId){
                    const index = cart.customBoxes.indexOf(item)
                    if (index !== -1) {
                        cart.customBoxes.splice(index, 1)
                        cart.totalPrice -= item.products.precio*item.quantity
                        await this.model.updateOne({id: cid}, cart)
                        return cart
                    }
                }
            }
            for(let item of cart.relaxBoxes){
                if(item._id == itemId){
                    const index = cart.relaxBoxes.indexOf(item)
                    if (index !== -1) {
                        cart.relaxBoxes.splice(index, 1)
                        cart.totalPrice -= item.precio*item.quantity
                        await this.model.updateOne({id: cid}, cart)
                        return cart
                    }
                }
            }
        } catch (error) {
            return new Error(error)
        }
    }

    clearCart = async(cid)=>{
        try {
            const cart = await this.model.findOne({id: cid})
            cart.boxes = []
            cart.customBoxes = []
            cart.relaxBoxes = []
            cart.totalPrice = 0
            await this.model.updateOne({id: cid}, cart)
            return cart
        } catch (error) {
            return new Error(error)
        }
    }

    updateCart = async(cid, boxes, customBoxes)=>{
        try {
            const cart = await this.model.findOne({id: cid})
            let totalPrice = 0
            cart.boxes = boxes
            cart.customBoxes = customBoxes
            if(cart.boxes.length > 0){
                for(let item of cart.boxes){
                    item.box = await boxManager.getBoxById(item.box.codigo)
                    totalPrice += item.box.precio*item.quantity
                }
            }
            if(cart.customBoxes.length > 0){
                for(let item of cart.customBoxes){
                    let customSum = 0
                    const estuche = await productManager.getProductByName(item.products.estuche)
                    customSum += estuche.precio
                    for(let bot of item.products.botellas){
                        bot = await productManager.getProductByName(bot.nombre)
                        customSum += bot.precio
                    }
                    if(item.products.delis.length > 0){
                        for(let del of item.products.delis){
                            del = await productManager.getProductByName(del.nombre)
                            customSum += del.precio
                        }
                    }
                    item.products.precio = customSum
                    totalPrice += customSum*item.quantity
                }
            }
            cart.totalPrice = totalPrice
            await this.model.updateOne({id: cid}, cart)
            return cart
        } catch (error) {
            return new Error(error)
        }
    }
}

export const cartManager = new CartManager()