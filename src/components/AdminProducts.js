import React from 'react'
import axios from 'axios';
import { Loader } from "./Loader.js"
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import siteContext from './siteContext.js';

class AdminProducts extends React.Component {
    static contextType = siteContext
    constructor(props) {
        super(props);
        this.state = {
            estuches: [],
            botellas: [],
            delis: [],
            isLoading: true
        };
    }
    
    async componentDidMount() {
        const user = this.context.contextUser
        if(user.role != "admin"){
            setTimeout(() => {
                window.location.href = "/"
            }, 1000)
        }

        const respuesta = await axios.get(`${process.env.REACT_APP_APIURL}api/products`, { withCredentials: true });
        const products = await respuesta.data
        const estuches = []
        const botellas = []
        const delis = []

        for(let prod of products){
            if(prod.tipo === "estuche"){ 
                estuches.push(prod)
            }else if(prod.tipo === "bebida"){ 
                botellas.push(prod)
            }else{
                delis.push(prod)
            }
        }

        this.setState({
            estuches: estuches,
            botellas: botellas,
            delis: delis,
            isLoading: false
        });
    }

    async handleSendAll(){
            const forms = document.getElementsByName("priceForm")
            const formArray = []
            for(let item of forms){
                if(item.precio.value != ""){
                    var product = {
                        codigo: item.dataset.codigo,
                        precio: Number(item.precio.value)
                    }
                    formArray.push(product)
                }
            }
            await axios({
                method: "put",
                url: `${process.env.REACT_APP_APIURL}api/products/changePrice`,
                data:{
                    formArray,
                    type: "array"
                },
                withCredentials: true
            })
            window.location.reload()
    }

    async handlePriceChange(evt, type){
        evt.preventDefault()
        this.setState({isLoading: true})
        await axios({
            method: "put",
            url: `${process.env.REACT_APP_APIURL}api/products/changePrice`,
            data: {
                codigo: type.codigo,
                precio: evt.target.precio.value,
                type: "object"
            },
            withCredentials: true
        })
        this.setState({isLoading: false})
        window.location.reload()
    }

    async handleDeleteProduct(pid){
        Swal.fire({
            title: '¿Seguro que querés eliminar este producto?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then(async(result) => {
            if (result.isConfirmed) {
                await axios({
                    method: "delete",
                    url: `${process.env.REACT_APP_APIURL}api/products/deleteProduct/${pid}`,
                    withCredentials: true
                })
                window.location.reload()
            } else if (result.isDenied) {
              Swal.fire('El producto NO fue eliminado')
            }
          })
    }

    render() {
        return (
            <section id="customBoxContainer">
                {this.state.isLoading ? <Loader/> : null}
                {this.context.contextUser.role != "admin" ? <h1 className='w-100 h-100 position-absolute bg-danger text-center'>ACCESO DENEGADO</h1> : null}
                <div className='d-flex justify-content-between'>
                    <Link to="/admin" className='buttn my-3'>Volver</Link>
                    <button className='buttn my-3' onClick={this.handleSendAll}>APLICAR TODO</button>
                </div>
                
                {this.state.isLoading ? <Loader/> : null}
                <div id="customBoxContainer-item1">
                    <div className="brand">
                        <h2>Estuches</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.estuches.map(est=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={est.codigo}>
                                    <img src={"../" + est.img} alt="..." />
                                    <h2>{est.nombre}</h2>
                                    <h3>${est.precio}</h3>
                                    <form onSubmit={(evt)=>this.handlePriceChange(evt, est)} name='priceForm' data-codigo={est.codigo}>
                                        <input type='number' placeholder='Cambiar precio' name='precio' className='opacity-100'></input>
                                        <input type='submit' className='opacity-100 buttn w-50 mt-2'></input>
                                    </form>
                                    <button className='buttn mt-2' onClick={()=>this.handleDeleteProduct(est.codigo)}>Eliminar</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div id="customBoxContainer-item2">
                    <div className="brand">
                        <h2>Vinos y espumantes</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.botellas.map(bot=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={bot.codigo}>
                                    <img src={"../" + bot.img} alt="..." />
                                    <h2>{bot.nombre}</h2>
                                    <h3>${bot.precio}</h3>
                                    <form onSubmit={(evt)=>this.handlePriceChange(evt, bot)} name='priceForm' data-codigo={bot.codigo}>
                                        <input type='number' placeholder='Cambiar precio' name='precio' className='opacity-100'></input>
                                        <input type='submit' className='opacity-100 buttn w-50 mt-2'></input>
                                    </form>
                                    <button className='buttn mt-2' onClick={()=>this.handleDeleteProduct(bot.codigo)}>Eliminar</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div id="customBoxContainer-item3">
                    <div className="brand">
                        <h2>Delicatessen</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.delis.map(del=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={del.codigo}>
                                    <img src={"../" + del.img} alt="..." />
                                    <h2>{del.nombre}</h2>
                                    <h3>${del.precio}</h3>
                                    <form onSubmit={(evt)=>this.handlePriceChange(evt, del)} name='priceForm' data-codigo={del.codigo}>
                                        <input type='number' placeholder='Cambiar precio' name='precio' className='opacity-100'></input>
                                        <input type='submit' className='opacity-100 buttn w-50 mt-2'></input>
                                    </form>
                                    <button className='buttn mt-2' onClick={()=>this.handleDeleteProduct(del.codigo)}>Eliminar</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        )
    }
}

export default AdminProducts