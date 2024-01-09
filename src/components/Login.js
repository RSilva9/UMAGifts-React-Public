import axios from "axios";
import React from "react";
import Swal from "sweetalert2";
import { useState, useEffect, useContext } from "react";
import { Loader } from "./Loader.js"
import siteContext from "./siteContext.js";
import { Link } from "react-router-dom";

function Login(){
    const [isLoading, setIsLoading] = useState(true)
    const [cart, setCart] = useState(null)
    const [orders, setOrders] = useState(null)
    const { contextUser: user } = useContext(siteContext)

    const handleRegister = async(event)=>{
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)
        const data = {}
        formData.forEach((value, key)=>{
            data[key] = value
        })

        if(!data.newsletter){
            data.newsletter = "no"
        }
        const response = axios({
            method: 'post',
            url: `${process.env.REACT_APP_APIURL}api/users/register`,
            data,
            withCredentials: true
          }).then(function (response) {
            if(response.data && response.data=="Success"){
                document.getElementById("loginReady").classList.remove("d-none")
            }
          })
          .catch(function (error) {
            Swal.fire({
                title: 'Ya existe un usuario registrado con ese email',
                showCloseButton: true,
            })
          });
    }

    const handleLogin = async(event)=>{
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)
        const data = {}
        formData.forEach((value, key)=>{
            data[key] = value
        })
        const response = axios({
            method: 'post',
            url: `${process.env.REACT_APP_APIURL}api/users/login`,
            data,
            withCredentials: true
          }).then(async function(response) {
            if(response.data && response.data=="Success"){
                window.location = "/"
            }
          })
          .catch(function (error) {
            Swal.fire({
                title: 'Email o contraseña incorrectos.',
                showCloseButton: true,
            })
          });
    }

    const handleLogout = async()=>{
        await axios.get(`${process.env.REACT_APP_APIURL}api/users/logout`, { withCredentials: true })
        .then(function(response){
            if(response.data == "Logged out")
            window.location.reload()
        })
    }

    const handleRepeatPurchase = async(orderBoxes, orderCustomBoxes, orderTotalPrice)=>{
        setIsLoading(true)
        if(user.cartId){
            await axios({
                method: "put",
                url: `${process.env.REACT_APP_APIURL}api/carts/updateCart/${user.cartId}`,
                data: {
                    boxes: orderBoxes,
                    customBoxes: orderCustomBoxes
                },
                withCredentials: true
            })
            setIsLoading(false)
            window.location.href = "/carrito"
        }
    }

    const handleViewContent = (id)=>{
        for(let item of orders){
            if(item._id == id){
                Swal.fire({
                    html: `
                    <div className="popup">
                        <div>
                            ${item.content.boxes.length > 0 ? 
                                "<h3><strong>BOX Prearmadas:</strong></h3>"
                                :
                                ""
                            }
                            <ul>
                                ${item.content.boxes.map(item =>
                                    `
                                    <li>
                                        <p>x${item.quantity} | Codigo: ${item.box.codigo}</p>
                                        <ul>
                                            ${item.box.content.map(prod => `<li>${prod.product.nombre}</li>`).join('')}
                                        </ul>
                                    </li>
                                    <hr></hr>
                                    `
                                ).join('')}
                            </ul>
                        </div>
                        <div>
                        ${item.content.customBoxes.length > 0 ? 
                            "<h3><strong>BOX Personalizadas:</strong></h3>"
                            :
                            ""
                        }
                            <ul>
                                ${item.content.customBoxes.length > 0 ? item.content.customBoxes.map(item =>
                                    `
                                    <li>
                                        <p>x${item.quantity} </p>
                                        <ul><li>${item.products.estuche}</li></ul>
                                        <ul>
                                            ${item.products.botellas.map(bot => `<li>${bot.nombre}</li>`).join('')}
                                        </ul>
                                        <ul>
                                            ${item.products.delis.map(del => `<li>${del.nombre}</li>`).join('')}
                                        </ul>
                                    </li>
                                    <hr></hr>
                                    `
                                ).join('') : ""}
                            </ul>
                        </div>
                    </div>
                    `,
                    showCloseButton: true,
                    showDenyButton: false,
                    confirmButtonColor: '#9ebc4a',
                    confirmButtonText: 'Cerrar',
                })
            }
        }
    }

    useEffect(()=>{
        async function fetchData() {
            try {
                if (user.cartId) {
                    const fetchedCart = await axios.get(`${process.env.REACT_APP_APIURL}api/carts/${user.cartId}`, { withCredentials: true })
                    const fetchedOrders = await axios.get(`${process.env.REACT_APP_APIURL}api/orders/${user.email}`, { withCredentials: true });
                    setCart(fetchedCart.data)
                    setOrders(fetchedOrders.data)
                    setIsLoading(false)
                } else {
                    console.log("User not found")
                    setIsLoading(false)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [user])

    if(isLoading){
        return ( <Loader/>)
    }

    if (user && user.cartId) {
        return (
            <div id="profileContainer">
                <div className="d-flex justify-content-between">
                    <h1>Tu cuenta</h1>
                    <button className="buttn" onClick={handleLogout}>Cerrar sesión</button>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-md-6">
                        <div>
                            <h3>Nombre</h3>
                            <p>{user.first_name} {user.last_name}</p>
                        </div>
                        <div className="mt-4">
                            <h3>Email</h3>
                            <p>{user.email}</p>
                        </div>
                        <div className="mt-4">
                            <h3>Compras recientes</h3>
                            <div className="overflow-auto" style={{ maxHeight: 500 }}> 
                                {orders.length > 0 ? orders.map(item=>(
                                <div className='longCard justify-content-between' key={item._id}>
                                    <div>
                                        <div>
                                            <h3>{item.date}</h3>
                                            <h3>{item.content.boxes.length} BOX prearmadas.</h3>
                                            <h3>{item.content.customBoxes.length > 0 ? item.content.customBoxes.length : 0} BOX personalizadas.</h3>
                                        </div>
                                    </div>
                                    <hr className='d-block d-md-none'></hr>
                                    <div>
                                        <button className="buttn m-1" onClick={()=> handleViewContent(item._id)}>Ver detalles</button>
                                        <button className="buttn m-1" onClick={()=> handleRepeatPurchase(item.content.boxes, item.content.customBoxes, item.content.totalPrice)}>Repetir compra</button>
                                    </div>
                                </div>
                                )) : <h4>No tenés compras recientes.</h4>}
                            </div>
                        </div>
                    </div>
                    <hr className="d-flex d-md-none"></hr>
                    <div className="col-md-6">
                        <h2>Tu carrito <small className="opacity-75">(id: {cart.id})</small></h2>
                        <div className="overflow-auto" style={{ maxHeight: 500 }}>
                            {cart.boxes.map(item=>(
                            <div className='longCard m-0 mb-3' key={item.box.codigo}>
                                <div id="firstHalf">
                                    <img src={item.box.img} alt="Box prearmada"/>
                                    <div>
                                        <h3>{item.box.codigo}: BOX de {item.box.tipo} {item.box.tam}</h3>
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
                                        <h3>Cantidad:</h3>
                                        <h3>{item.quantity}</h3>
                                    </div>
                                </div>
                            </div>
                            ))}
                            <hr></hr>
                            {cart.customBoxes.map(item=>(
                            <div className='longCard m-0 mb-3' key={item._id}>
                                <div id="firstHalf">
                                    {(item.products.botellas.length == 1 && item.products.delis.length == 0) ? <img src="./img/icons/Simple.webp" alt="Box prearmada"/> : ""}
                                    {item.products.botellas.length == 2 ? <img src="./img/icons/Doble2V.webp" alt="Box prearmada"/> : ""}
                                    {item.products.delis.length > 0 ? <img src="./img/icons/DobleDeli.webp" alt="Box prearmada"/> : ""}
                                    <div>
                                        <h3>{item.products.estuche}</h3>
                                        {item.products.botellas.map(bot=>(
                                            <h3 key={bot.nombre}>• {bot.nombre}</h3>
                                        ))}
                                        <h3>+{item.products.delis.length} delis</h3>
                                    </div>
                                </div>
                                <hr className='d-block d-md-none'></hr>
                                <div id="secondHalf">
                                    <div >
                                        <h3>Cantidad:</h3>
                                        <h3>{item.quantity}</h3>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <Link to="/carrito" className='buttn'>Ir al carrito</Link>
                    </div>
                </div>
            </div>
        )
    } else {
        return(
            <div className="d-flex flex-column flex-sm-row justify-content-around">
                <section>
                    <form className="delicate-form" onSubmit={handleRegister}>
                        <h2>Registrarse</h2>
                        <div className="form-group">
                            <label htmlFor="first_name">Nombre</label>
                            <input type="text" name="first_name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Apellido</label>
                            <input type="text" name="last_name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" name="password" required />
                        </div>
                        <div className="checkbox-group">
                            <input type="checkbox" name="newsletter" value="yes"></input>
                            <label htmlFor="newsletter">Recibir promociones a mi correo electrónico.</label>
                        </div>
                        
                        <button type="submit" className="buttn">Registrarse</button>
                        <div id="loginReady" className="d-none">
                            <h3>Ya podés iniciar sesión</h3>
                        </div>
                    </form>
                </section>
                <section>
                    <form className="delicate-form" onSubmit={handleLogin}>
                        <h2>Iniciar sesión</h2>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" name="password" required />
                        </div>
                        <button type="submit" className="buttn">Iniciar sesión</button>
                    </form>
                </section>
            </div>  
        )
    }
}

export default Login