import React, { useState, useEffect } from 'react'
import { Loader } from './Loader.js';
import axios from 'axios';
import Swal from "sweetalert2";
import { useContext } from 'react';
import siteContext from './siteContext.js';

function Cart(){
    const { contextUser: user } = useContext(siteContext)
    const [cart, setCart] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [loaderMode, setLoaderMode] = useState(null)
    
    const getCart = async()=>{
        try {
            if(user != [] && user.cartId){
                const response2 = await axios.get(`${process.env.REACT_APP_APIURL}api/carts/${user.cartId}`, { withCredentials: true })
                assembleCart(response2.data)
            }else{
                var totalPrice = 0
                const boxes = JSON.parse(localStorage.getItem("boxes")) || []
                const customBoxes = JSON.parse(localStorage.getItem("customBoxes")) || []
                const relaxBoxes = JSON.parse(localStorage.getItem("relaxBoxes")) || []
                for(let item of boxes){
                    totalPrice += item.box.precio*item.quantity
                }
                for(let item of customBoxes){
                    totalPrice += item.products.precio*item.quantity
                }
                for(let item of relaxBoxes){
                    totalPrice += item.precio*item.quantity
                }
                const localCart = {
                    boxes,
                    customBoxes,
                    relaxBoxes,
                    totalPrice
                }
                assembleCart(localCart)
            }
        } catch (error) {
            var totalPrice = 0
            const boxes = JSON.parse(localStorage.getItem("boxes")) || []
            const customBoxes = JSON.parse(localStorage.getItem("customBoxes")) || []
            for(let item of boxes){
                totalPrice += item.box.precio*item.quantity
            }
            for(let item of customBoxes){
                totalPrice += item.products.precio*item.quantity
            }
            const localCart = {
                boxes,
                customBoxes,
                totalPrice
            }
            assembleCart(localCart)
        } finally {
            setIsLoading(false)
        }
    }

    const assembleCart = (cart)=>{
        const boxes = cart.boxes || []
        const customBoxes = cart.customBoxes || []
        const relaxBoxes = cart.relaxBoxes || []
        const totalPrice = cart.totalPrice
        const newCart = {
            boxes,
            customBoxes,
            relaxBoxes,
            totalPrice
        }
        setCart(newCart)
    }

    useEffect(() => {
        getCart()
    }, [])

    if (isLoading) {
        return (
            <Loader mode={loaderMode}/>
        );
    }

    if(cart == null || (cart.boxes.length < 1 && cart.customBoxes.length < 1 && cart.relaxBoxes.length < 1)){
        return(
            <div className='carritoVacio'>
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16">
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                </svg>
                <h2>Tu carrito está vacío</h2>
            </div>
        )
    }
    
    const showDelis = (id)=>{
        const hiddenDiv = document.getElementById(id)
        if(hiddenDiv.classList.contains("d-none")){
            hiddenDiv.classList.remove("d-none")
        }else{
            hiddenDiv.classList.add("d-none")
            hiddenDiv.classList.remove("d-block")
        }
    }

    const removeFromCart = async(item) =>{
        console.log(item)
        if(user.cartId){
            setIsLoading(true)
            setLoaderMode("transp")
            await axios.delete(`${process.env.REACT_APP_APIURL}api/carts/removeProduct/${user.cartId}/${item._id}`, { withCredentials: true })
            .then((response)=>{
                assembleCart(response.data)
                setIsLoading(false)
                setLoaderMode(null)
            })
        }else{
            if(item.products.esponja){
                console.log("HOLA")
                const newRelaxBoxes = cart.relaxBoxes.filter(prod => prod.products.esponja !== item.products.esponja)
                const newPrice = cart.totalPrice -= item.precio*item.quantity
                setCart(prevCart => ({
                    ...prevCart,
                    relaxBoxes: newRelaxBoxes,
                    totalPrice: newPrice
                }))
                localStorage.setItem("relaxBoxes", JSON.stringify(newRelaxBoxes))
            }
            else if(item.products){
                const newBoxes = cart.customBoxes.filter(prod => prod.products.id !== item.products.id)
                const newPrice = cart.totalPrice -= item.products.precio*item.quantity
                setCart(prevCart => ({
                    ...prevCart,
                    customBoxes: newBoxes,
                    totalPrice: newPrice
                }))
                localStorage.setItem("customBoxes", JSON.stringify(newBoxes))
            }
            else{
                const newBoxes = cart.boxes.filter(prod => prod.box._id !== item.box._id)
                const newPrice = cart.totalPrice -= item.box.precio*item.quantity
                setCart(prevCart => ({
                    ...prevCart,
                    boxes: newBoxes,
                    totalPrice: newPrice
                }))
                localStorage.setItem("boxes", JSON.stringify(newBoxes))
            }
        }
    }

    const clearCart = async()=>{
        if(user.cartId){
            setIsLoading(true)
            setLoaderMode("transp")
            const resp = await axios.delete(`${process.env.REACT_APP_APIURL}api/carts/clearCart/${user.cartId}`, { withCredentials: true })
            setCart(resp.data)
            setIsLoading(false)
            setLoaderMode(null)
        }else{
            localStorage.clear()
            setCart(null)
        }
    }

    const checkout = async(evt)=>{
        evt.preventDefault()
        const checkoutForm = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            envio: document.getElementById('envio').checked,
            barrio: document.getElementById('barrio').value,
            direccion: document.getElementById('direccion').value,
        }
        setIsLoading(true)
        const res = await axios({
            method: "post",
            url: `${process.env.REACT_APP_APIURL}api/carts/checkout`,
            data: 
            {
                checkoutForm,
                cart
            },
            withCredentials: true
        })
        setIsLoading(false)
        Swal.fire({
            icon: 'success',
            confirmButtonColor: '#9ebc4a',
            denyButtonColor: '#7c3359',
            confirmButtonText: 'Listo',
            title: `Pedido enviado con éxito. Revisa tu correo para ver tu orden.\nSi no recibiste un correo automático, volvé a hacer la compra y asegurate de ingresar correctamente tu email.`,
        }).then((result)=>{
            if(result.isConfirmed || result.dismiss){
                clearCart()
                window.location.href = "/"
            }
        })
    }

    return(
        <>
        <div id="cartContainer">
            <div className='d-flex justify-content-between'>
                <h1>Tu carrito</h1>
                <button className='buttn h-50' onClick={()=>clearCart()}>Limpiar carrito</button>
            </div>
            <div>
                <div>
                    <h3 className='ms-2'>BOX prearmadas</h3>
                    {cart.boxes.map(item=>(
                        <div className='longCard' key={item.box.codigo}>
                            <div id="firstHalf">
                                <img src={item.box.img} alt="Box prearmada"/>
                                <div>
                                    <h3>{item.box.codigo}: BOX de {item.box.tipo} {item.box.tam}</h3>
                                    <button onClick={() => showDelis(item.box._id)} className='buttn'>Ver detalles</button>
                                    <div id={item.box._id} className="d-none">
                                        {item.box.content.map(prod=>(
                                            <h3 key={prod.product.nombre}>• {prod.product.nombre}</h3>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr className='d-block d-md-none'></hr>
                            <div id="secondHalf">
                                <div >
                                    <h3>Precio por unidad:</h3>
                                    <h3>${item.box.precio}</h3>
                                </div>
                                <div >
                                    <h3>Cantidad:</h3>
                                    <h3>{item.quantity}</h3>
                                </div>
                                <a onClick={()=> removeFromCart(item)} id="borrarProd">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={"#69224e"} className="bi bi-trash3" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                <hr></hr>
                <div>
                    <h3 className='ms-2'>BOX personalizadas</h3>
                    {cart.customBoxes.map(item=>(
                        <div className='longCard' key={item._id}>
                            <div id="firstHalf">
                                {(item.products.botellas.length == 1 && item.products.delis.length == 0) ? <img src="./img/icons/Simple.webp" alt="Box prearmada"/> : ""}
                                {item.products.botellas.length == 2 ? <img src="./img/icons/Doble2V.webp" alt="Box prearmada"/> : ""}
                                {item.products.delis.length > 0 ? <img src="./img/icons/DobleDeli.webp" alt="Box prearmada"/> : ""}
                                <div>
                                    <h3>{item.products.estuche}</h3>
                                    {item.products.botellas.map(bot=>(
                                        <h3 key={bot.nombre}>• {bot.nombre}</h3>
                                    ))}
                                    {item.products.delis.length > 0 ? <button onClick={() => showDelis(item.products.id)} className='buttn'>+{item.products.delis.length} delis</button> : ""}
                                    <div id={item.products.id} className="d-none">
                                        {item.products.delis.map(del=>(
                                            <h3 key={del.nombre}>• {del.nombre}</h3>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr className='d-block d-md-none'></hr>
                            <div id="secondHalf">
                                <div >
                                    <h3>Precio por unidad:</h3>
                                    <h3>${item.products.precio}</h3>
                                </div>
                                <div >
                                    <h3>Cantidad:</h3>
                                    <h3>{item.quantity}</h3>
                                </div>
                                <a onClick={()=> removeFromCart(item)} id="borrarProd">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={"#69224e"} className="bi bi-trash3" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                <hr></hr>
                <div>
                    <h3 className='ms-2'>BOX Relax</h3>
                    {cart.relaxBoxes.map(item=>(
                        <div className='longCard' key={item._id}>
                            <div id="firstHalf">
                                <img src="./img/relax/Azul.webp" alt="Box relax" className="p-2"/>
                                <div>
                                    <h3>Box Relax</h3>
                                    <button onClick={() => showDelis(item.products.esponja)} className='buttn'>+6 productos</button>
                                    <div id={item.products.esponja} className="d-none">
                                        <h3>• {item.products.esponja}</h3>
                                        <h3>• {item.products.homeSpray}</h3>
                                        <h3>• {item.products.jabon}</h3>
                                        <h3>• {item.products.sales}</h3>
                                        <h3>• {item.products.vela}</h3>
                                    </div>
                                </div>
                            </div>
                            <hr className='d-block d-md-none'></hr>
                            <div id="secondHalf">
                                <div >
                                    <h3>Precio por unidad:</h3>
                                    <h3>${item.precio}</h3>
                                </div>
                                <div >
                                    <h3>Cantidad:</h3>
                                    <h3>{item.quantity}</h3>
                                </div>
                                <a onClick={()=> removeFromCart(item)} id="borrarProd">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={"#69224e"} className="bi bi-trash3" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                <hr></hr>
                <h3>Precio final: ${cart.totalPrice}</h3>
            </div>
        </div>
        <div id="formPedido">
            <form id='checkoutForm' onSubmit={(evt)=> checkout(evt)}>
                <div className="d-flex flex-column flex-sm-row justify-content-evenly flex-grow-1">
                    <div id="nombreCorreo">
                        <input type="text" name="name" id="nombre" placeholder="Nombre" required />
                        <input type="text" name="email" id="email" placeholder="Correo" required />
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <div id="radiosRetiro">
                            <div>
                                <input type="checkbox" name="envio" id="envio" onChange={({target})=>{
                                    const envRet = document.getElementById("envRet")
                                    const barrio = document.getElementById("barrio")
                                    const direccion = document.getElementById("direccion")
                                    if(target.checked == true){
                                        envRet.classList.remove("d-none")
                                        barrio.required = true
                                        direccion.required = true
                                    }else{
                                        envRet.classList.add("d-none")
                                        barrio.value = ""
                                        direccion.value = ""
                                        barrio.required = false
                                        direccion.required = false
                                    }
                                }}/>
                                <h5 className="ms-1 my-auto">Envío a domicilio</h5>
                            </div>
                        </div>
                        <div id="envRet" className="d-none">
                            <input type="text" name="Barrio" id="barrio" placeholder="Barrio"/>
                            <input type="text" name="Direccion" id="direccion" placeholder="Calle y número"/>
                        </div>
                    </div>
                </div>
                <div id="divBoton">
                    <button className="buttn" type="submit" name="submit">Enviar pedido</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default Cart