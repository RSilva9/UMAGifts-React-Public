import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Loader } from "./Loader.js";
import siteContext from "./siteContext.js";

function ItemCount(bid){
    const [count, setCount] = useState(0)
    const [loaderMode, setLoaderMode] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { contextUser: user } = useContext(siteContext)
    
    const handleSuma = ()=>{
        setCount(prevCount => prevCount + 1)
    }
    const handleResta = ()=>{
        if(count != 0){
            setCount(prevCount => prevCount - 1)
        }
    }
    const handleAddToCart = async()=>{
        if(user.cartId){
            setIsLoading(true)
            const result = await axios({
                method: 'put',
                url: `${process.env.REACT_APP_APIURL}api/carts/addBoxToCart/${bid.bid}/${count}`,
                withCredentials: true
            })
            setIsLoading(false)
            Swal.fire({
                icon: 'success',
                confirmButtonColor: '#9ebc4a',
                denyButtonColor: '#7c3359',
                confirmButtonText: 'Seguir comprando',
                denyButtonText: 'Ir al carrito',
                showDenyButton: true,
                title: `Agregaste ${count} BOX al carrito`,
            }).then((result)=>{
                if(result.isDenied){
                    window.location = "carrito"
                }
            })
        }else{
            const box = await axios.get(`${process.env.REACT_APP_APIURL}api/boxes/${bid.bid}`, { withCredentials: true })
            const newBox = {
                box: box.data,
                quantity: count
            }
            let localBoxArray = JSON.parse(localStorage.getItem("boxes")) || []
            var found = false
            for(let item of localBoxArray){
                if(item.box.codigo == newBox.box.codigo){
                    item.quantity += newBox.quantity
                    found = true
                }
            }
            if(found == false) localBoxArray.push(newBox)
            localStorage.setItem("boxes", JSON.stringify(localBoxArray))

            Swal.fire({
                icon: 'success',
                confirmButtonColor: '#9ebc4a',
                denyButtonColor: '#7c3359',
                confirmButtonText: 'Seguir comprando',
                denyButtonText: 'Ir al carrito',
                showDenyButton: true,
                title: `Agregaste ${count} BOX al carrito`,
            }).then((result)=>{
                if(result.isDenied){
                    window.location = "carrito"
                }
            })
        }
    }

    if (isLoading) {
        return (
            <Loader mode={loaderMode}/>
        );
    }

    return(
        <div>
            <div className="counter">
                <button className="counter-button counter-button-left" onClick={handleResta}>-</button>
                <span className="counter-value">{count}</span>
                <button className="counter-button counter-button-right" onClick={handleSuma}>+</button>
            </div>
            <button id="addButton" className='buttn' onClick={handleAddToCart} disabled={count === 0}>Agregar al carrito</button>
        </div>
    )
}

export default ItemCount;