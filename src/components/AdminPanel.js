import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import siteContext from './siteContext.js';

function AdminPanel(){
    const { contextUser: user } = useContext(siteContext)
    if(user.role != "admin"){
        window.location.href = "/"
    }

    return(
        <div id="profileContainer">
            {user.role != "admin" ? <h1 className='w-100 h-100 position-absolute bg-danger text-center'>ACCESO DENEGADO</h1> : null}
            <h1>Panel de administrador</h1>
            <div className='m-4 d-flex justify-content-around'>
                <Link to="/admin/products" className='buttn'>Administrar productos</Link>
                <Link to="/admin/orders" className='buttn'>Administrar ordenes</Link>
                <Link to="/admin/users" className='buttn'>Administrar usuarios</Link>
            </div>
        </div>
    )
}

export default AdminPanel