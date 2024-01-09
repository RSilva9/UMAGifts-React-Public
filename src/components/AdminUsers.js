import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Loader } from './Loader.js';
import axios from 'axios';
import Swal from "sweetalert2";
import siteContext from './siteContext.js';

function AdminUsers(){
    const { contextUser: user } = useContext(siteContext)
    if(user.role != "admin"){
        window.location.href = "/"
    }

    const [users, setUsers] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const getUsers = async()=>{
        const result = await axios.get(`${process.env.REACT_APP_APIURL}api/users/`, { withCredentials: true })
        setUsers(result.data)
        setIsLoading(false)
    }

    useEffect(() => {
        getUsers()
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
            <div className='m-4 tableContainer'>
                <table>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Cart ID</th>
                        <th>Newsletter</th>
                        <th>Rol</th>
                        <th>_id</th>
                        <th>Acciones</th>
                    </tr>
                    {users.map(item=>(
                        <tr key={item._id}>
                            <td>{item.first_name}</td>
                            <td>{item.last_name}</td>
                            <td>{item.email}</td>
                            <td>{item.cartId}</td>
                            <td>{item.newsletter}</td>
                            <td>{item.role}</td>
                            <td>{item._id}</td>
                            <td>
                                {/* <button onClick={async()=>{
                                    await axios.put(`${process.env.REACT_APP_APIURL}api/users/changeRole/${item._id}`, { withCredentials: true })
                                    window.location.reload()
                                }}>Cambiar rol</button> */}
                                <button onClick={async()=>{
                                    await axios.delete(`${process.env.REACT_APP_APIURL}api/users/${item._id}`, { withCredentials: true })
                                    window.location.reload()
                                }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default AdminUsers