import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";
import { boxManager } from "../managers/BoxManager.js";

export const productRouter = Router()

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
      return next();
    }
    return res.status(403).send("Acceso denegado. No tienes permisos de administrador.");
}

productRouter.get('/', async(req, res)=>{
    try {
        const products = await productManager.getProducts()
        res.status(200).send(products)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

productRouter.get('/:pid', async(req, res)=>{
    try {
        const productCodigo = req.params.pid
        const product = await productManager.getProductById(productCodigo)
        res.status(200).send(product)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

productRouter.put('/changePrice', isAdmin, async(req, res)=>{
    try {
        if(req.body.type == "object"){
            var codigo = req.body.codigo
            var precio = req.body.precio
            const product = {
                codigo,
                precio
            }
            var newProduct = await productManager.changePrice(product)
            await boxManager.updateBoxPrice()
        }else{
            var newProduct = await productManager.changePrice(req.body.formArray)
            await boxManager.updateBoxPrice()
        }
        res.status(200).send(newProduct)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

productRouter.delete('/deleteProduct/:pid', isAdmin, async(req,res)=>{
    try {
        const response = await productManager.deleteProduct(req.params.pid)
        res.status(200).send(response)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})