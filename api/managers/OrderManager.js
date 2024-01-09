import { orderModel } from '../models/order.model.js'

class OrderManager{
    constructor(model){
        this.model = orderModel
    }

    createOrder = async(order)=>{
        try {
            return await this.model.create(order)
        } catch (error) {
            return new Error(error)
        }
    }

    getOrders = async()=>{
        try {
            return await this.model.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    finishOrder = async(orderId)=>{
        try {
            const fetchedOrder = await this.model.findById(orderId)
            fetchedOrder.finished = true
            return await fetchedOrder.save()
        } catch (error) {
            return new Error(error)
        }
    }

    getOrdersByEmail = async(userEmail)=>{
        try {
            return await this.model.find({ 'user.email': userEmail })
        } catch (error) {
            return new Error(error)
        }
    }
}

export const orderManager = new OrderManager()