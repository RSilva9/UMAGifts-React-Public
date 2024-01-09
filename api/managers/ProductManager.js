import { productModel } from '../models/product.model.js'

class ProductManager{
    constructor(model){
        this.model = productModel
    }

    getProducts = async()=>{
        try {
            const products = await this.model.find({})
            return products
        } catch (error) {
            return error
        }
    }

    getProductById = async(pid)=>{
        try {
            const product = await this.model.findOne({codigo: pid}).exec()
            return product
        } catch (error) {
            return error
        }
    }

    getProductByName = async(name)=>{
        try {
            const product = await this.model.findOne({nombre: name}).exec()
            return product
        } catch (error) {
            return error
        }
    }

    changePrice = async(products)=>{
        try {
            const DBproducts = await this.model.find()
            if(products.length > 0){
                for(let item of products){
                    for(let prod of DBproducts){
                        if(item.codigo == prod.codigo){
                            prod.precio = item.precio
                            await this.model.updateOne({codigo: item.codigo}, prod)
                        }
                    }
                }
            }else{
                for(let item of DBproducts){
                    if(products.codigo == item.codigo){
                        item.precio = products.precio
                        return await this.model.updateOne({codigo: item.codigo}, item)
                    }
                }
            }
        } catch (error) {
            return error
        }
    }

    deleteProduct = async(pid)=>{
        try {
            return await this.model.findOneAndDelete({ codigo: pid })
        } catch (error) {
            return error
        }
    }
}

export const productManager = new ProductManager()