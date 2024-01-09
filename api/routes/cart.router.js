import { Router } from "express";
import { cartManager } from "../managers/CartManager.js";
import { transporter } from "../utils.js";
import { orderManager } from "../managers/OrderManager.js"
import dotenv from 'dotenv'
dotenv.config()

export const cartRouter = Router()

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
      return next();
    }
    return res.status(403).send("Acceso denegado. No tienes permisos de administrador.");
}

cartRouter.post('/createCart', async(req, res)=>{
    try {
        const result = await cartManager.createCart()
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.put('/addBoxToCart/:pid/:count', async(req, res)=>{
    try {
        const cid = req.session.user.cartId
        const pid = req.params.pid
        const count = req.params.count
        const result = await cartManager.addBoxToCart(cid, pid, count)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.put('/addCustomBoxToCart/:count', async(req, res)=>{
    try {
        const count = req.params.count
        const customBox = req.body
        const cid = req.session.user.cartId
        const result = await cartManager.addCustomBoxToCart(customBox, count, cid)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.put('/addRelaxBoxToCart/:count', async(req, res)=>{
    try {
        const count = req.params.count
        const relaxBox = req.body
        const cid = req.session.user.cartId
        const result = await cartManager.addRelaxBoxToCart(relaxBox, count, cid)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.get('/:cid', async(req, res)=>{
    try {
        const cid = req.params.cid
        const result = await cartManager.getCartById(cid)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.delete('/removeProduct/:cid/:itemId', isAdmin, async(req, res)=>{
    try {
        const cid = req.params.cid
        const itemId = req.params.itemId
        const result = await cartManager.removeFromCart(itemId, cid)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.delete('/clearCart/:cid', async(req, res)=>{
    try {
        const cid = req.params.cid
        const result = await cartManager.clearCart(cid)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.post('/checkout', async(req, res)=>{
    try {
        const {checkoutForm, cart} = req.body
        let message = {
            from: process.env.UMA_EMAIL,
            to: checkoutForm.email,
            subject: 'RESUMEN DE TU COMPRA',
            html: `
            <h2>¡Gracias por realizar tu pedido!</h2>
            <h3>En las próximas horas te enviaremos los métodos de pago y los detalles de envío (costo y disponibilidad) en caso de que hayas seleccionado "Envío a domicilio".
            <h3>Tu orden:</h3>
            <div>
                <h4>BOX Prearmadas:</h4>
                <ul>
                    ${cart.boxes.map(item =>
                        `
                        <li>
                            <h4>Codigo: ${item.box.codigo}, cantidad: ${item.quantity}, precio por unidad: $${item.box.precio}</h4>
                            <h4></h4>
                            <ul>
                                ${item.box.content.map(prod => `<li>${prod.product.nombre}</li>`).join('')}
                            </ul>
                        </li>
                        `
                    ).join('')}
                </ul>
            </div>
            <div>
                ${cart.customBoxes.length > 0 ? "<h4>BOX Personalizadas:</h4>" : ""}
                <ul>
                    ${cart.customBoxes.map(item =>
                        `
                        <li>
                            <h4>${item.products.estuche}, cantidad: ${item.quantity}, precio por unidad: $${item.products.precio}</h4>
                            <ul>
                                ${item.products.botellas.map(bot => `<li>${bot.nombre}</li>`).join('')}
                            </ul>
                            <ul>
                                ${item.products.delis.map(del => `<li>${del.nombre}</li>`).join('')}
                            </ul>
                        </li>
                        `
                    ).join('')}
                </ul>
            </div>
            <div>
                ${cart.relaxBoxes.length > 0 ? "<h4>BOX Relax:</h4>" : ""}
                <ul>
                    ${cart.relaxBoxes.map(item =>
                        `
                        <li>
                            <h4>Box Relax, cantidad: ${item.quantity}, precio por unidad: $${item.precio}</h4>
                            <ul>
                                <li>${item.products.jabon}</li>
                                <li>${item.products.vela}</li>
                                <li>${item.products.sales}</li>
                                <li>${item.products.homeSpray}</li>
                                <li>${item.products.esponja}</li>
                            </ul>
                        </li>
                        `
                    ).join('')}
                </ul>
            </div>
            <h3>Subtotal: $${cart.totalPrice}</h3>
            `
        }
        let message2 = {
            from: process.env.UMA_EMAIL,
            to: process.env.UMA_EMAIL,
            subject: 'REALIZARON UNA COMPRA',
            html: `<h2>Realizaron una compra, revisa las órdenes en https://www.umagifts.com.ar o en los correos enviados.`
        }
        var newDate
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short', timeZone: 'America/Argentina/Buenos_Aires' };
        const formatoFecha = new Intl.DateTimeFormat('es-ES', opciones);
        const fechaFormateada = formatoFecha.format(newDate);
        var envioText
        if(checkoutForm.direccion != "" && checkoutForm.barrio != ""){
            envioText = `${checkoutForm.direccion}, ${checkoutForm.barrio}`
        }else{
            envioText = "No."
        }
        
        const newOrder = {
            user:{
                name: checkoutForm.nombre,
                email: checkoutForm.email,
            },
            envio: envioText,
            content: cart,
            finished: false,
            date: fechaFormateada
        }

        await orderManager.createOrder(newOrder)
        const result = await transporter.sendMail(message)
        await transporter.sendMail(message2)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

cartRouter.put('/updateCart/:cid', async(req, res)=>{
    try {
        const cid = req.params.cid
        const { boxes, customBoxes } = req.body
        const result = await cartManager.updateCart(cid, boxes, customBoxes)
        res.send(result)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }

})