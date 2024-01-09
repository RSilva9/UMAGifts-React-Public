import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Loader } from './Loader.js';
import axios from 'axios';
import Swal from "sweetalert2";
import siteContext from './siteContext.js';

function AdminOrders(){
    const [orders, setOrders] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const { contextUser: user } = useContext(siteContext)
    if(user.role != "admin"){
        window.location.href = "/"
    }

    const getOrders = async()=>{
        const result = await axios.get(`${process.env.REACT_APP_APIURL}api/orders/`, { withCredentials: true })
        setOrders(result.data)
        setIsLoading(false)
    }

    const handleViewContent = (id)=>{
        for(let item of orders){
            if(item._id == id){
                Swal.fire({
                    html: `
                    <div className="popup">
                        <div>
                            <div className="bgText">
                                <h3>BOX Prearmadas:</h3>
                            </div>
                            <ul>
                                ${item.content.boxes.map(item =>
                                    `
                                    <li>
                                        <p>x${item.quantity} | Codigo: ${item.box.codigo} | Precio por unidad: $${item.box.precio}</p>
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
                            <div className="bgText">
                                <h3>BOX Personalizadas:</h3>
                            </div>
                            <ul>
                                ${item.content.customBoxes.map(item =>
                                    `
                                    <li>
                                        <p>x${item.quantity} | Precio por unidad: $${item.products.precio}</p>
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
                                ).join('')}
                            </ul>
                        </div>
                        <div>
                            <div className="bgText">
                                <h3>BOX Relax:</h3>
                            </div>
                            <ul>
                                ${item.content.relaxBoxes.map(item =>
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
                                    <hr></hr>
                                    `
                                ).join('')}
                            </ul>
                        </div>
                        <h3>Precio final: $${item.content.totalPrice}</h3>
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

    const handleDeleteOrder = async(orderId)=>{
        if(user.role == "admin"){
            Swal.fire({
                icon: 'success',
                confirmButtonColor: '#9ebc4a',
                denyButtonColor: '#7c3359',
                confirmButtonText: 'Terminar',
                denyButtonText: 'Cancelar',
                title: `¿Estás seguro de terminar esta orden?`,
            }).then(async(result)=>{
                if(result.isConfirmed){
                    const result = await axios.put(`${process.env.REACT_APP_APIURL}api/orders/finishOrder/${orderId}`, { withCredentials: true })
                    window.location.reload()
                }
            })
        }else{
            alert("Acceso denegado.")
        }
    }

    useEffect(() => {
        getOrders()
    }, [])

    if (isLoading) {
        return (
            <Loader />
        );
    }
    
    return(
        <div>
            {user.role != "admin" ? <h1 className='w-100 h-100 position-absolute bg-danger text-center'>ACCESO DENEGADO</h1> : null}
            <Link to="/admin" className='buttn'>Volver</Link>
            <h1 className='m-3'>Ordenes pendientes</h1>
            <hr></hr>
            <div className='d-flex flex-content-around flex-wrap m-4'>
                {orders
                .filter(item => !item.finished)
                .map(item=>(
                    <div className='orderCard' key={item._id}>
                        <p><strong>Nombre del cliente:</strong> {item.user.name}</p>
                        <p><strong>Email:</strong> {item.user.email}</p>
                        <p><strong>Fecha:</strong> {item.date}</p>
                        <p><strong>Envio:</strong> {item.envio}</p>
                        <div className='d-flex justify-content-evenly w-100'>
                            <button className='buttn' onClick={()=> handleViewContent(item._id)}>Ver contenido</button>
                            <button className='buttn' onClick={()=> handleDeleteOrder(item._id)}>Terminar orden</button>
                        </div>
                    </div>
                ))}
            </div>
            <h1 className='m-3'>Ordenes terminadas</h1>
            <div className='d-flex flex-content-around flex-wrap m-4'>
                {orders
                .filter(item => item.finished)
                .map(item=>(
                    <div className='orderCard' key={item._id}>
                        <p><strong>Nombre del cliente:</strong> {item.user.name}</p>
                        <p><strong>Email:</strong> {item.user.email}</p>
                        <p><strong>Fecha:</strong> {item.date}</p>
                        <div className='d-flex justify-content-evenly w-100'>
                            <button className='buttn' onClick={()=> handleViewContent(item._id)}>Ver contenido</button>
                        </div>
                        
                    </div>
                ))}
            </div>

        </div>
    )
}

export default AdminOrders