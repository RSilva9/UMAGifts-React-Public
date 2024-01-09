import { Router } from "express";
import { orderManager } from "../managers/OrderManager.js"

export const orderRouter = Router()

// function isAdmin(req, res, next) {
//     console.log(req.session)
//     if (req.session.user && req.session.user.role == "admin") {
//       return next();
//     }
//     return res.status(403).send("Acceso denegado. No tienes permisos de administrador.");
// }

orderRouter.get('/', async(req, res)=>{
    try {
        const result = await orderManager.getOrders()
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

orderRouter.post('/createOrder', async(req, res)=>{
    try {
        const order = req.body
        const result = await orderManager.createOrder(order)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

orderRouter.put('/finishOrder/:orderId', async(req, res)=>{
    try {
        const orderId = req.params.orderId
        const result = await orderManager.finishOrder(orderId)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

orderRouter.get('/:userEmail', async(req, res)=>{
    try {
        const userEmail = req.params.userEmail
        const result = await orderManager.getOrdersByEmail(userEmail)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})