import React, { useState, useEffect } from 'react'
import { Accordion } from 'react-bootstrap';
import { Loader } from "./Loader.js"
import Swal from 'sweetalert2';
import ItemCount from './ItemCount.js';
import axios from 'axios';
import siteContext from './siteContext.js'

class FilteredBoxes extends React.Component {
    static contextType = siteContext
    constructor(props) {
        super(props);
        this.state = {
            boxesArray: [],
            isLoading: true
        };
    }

    async componentDidMount() {
        var { boxes } = this.context;
        
        this.setState({
            boxesArray: boxes,
            isLoading: false,
        });
        
        const tipoInputs = document.getElementsByName("tipo")
        const tamInputs = document.getElementsByName("tam")
        const deliInput = document.getElementById("deliCheckbox")
        const btnFiltros = document.getElementById("bFiltros")
        const btnReset = document.getElementById("bReset")
        
        var tipoCaja = ""
        var tamCaja = ""
        var deliCaja = ""

        for(let t of tipoInputs){
            t.addEventListener('click', ()=>{
                if(t.checked){
                    tipoCaja = t.value 
                    if(tipoInputs[2].checked){
                        tamInputs[0].checked = true
                        tamInputs[1].checked = false
                        tamInputs[1].disabled = true
                        tamCaja = "simple"
                    }else{
                        tamInputs[1].disabled = false
                    }
                }
            })
        }
        for(let tm of tamInputs){
            tm.addEventListener('click', ()=>{
                if(tm.checked){
                    tamCaja = tm.value
                }
            })
        }
        deliInput.addEventListener('click', ()=>{
            if(deliInput.checked){
                deliCaja = true
            }
            for(let t of tipoInputs){
                t.disabled = true
                t.checked = false
            }
            for(let tm of tamInputs){
                tm.disabled = true
                tm.checked = false
            }
        })
        btnFiltros.onclick = async()=>{
            let filteredBoxes = [...boxes]

            if (tipoCaja !== "") {
                filteredBoxes = filteredBoxes.filter(box => box.tipo === tipoCaja)
            }
            if (tamCaja !== "") {
                filteredBoxes = filteredBoxes.filter(box => box.tam === tamCaja)
            }
            if (deliCaja !== "") {
                filteredBoxes = boxes
                filteredBoxes = filteredBoxes.filter(box => box.deli === deliCaja)
            }

            this.setState({
                boxesArray: filteredBoxes
            });
        }
        btnReset.onclick = async()=>{
            for(let t of tipoInputs){
                t.disabled = false
                t.checked = false
            }
            for(let tm of tamInputs){
                tm.disabled = false
                tm.checked = false
            }
            deliInput.checked = false
            tipoCaja = ""
            tamCaja = ""
            deliCaja = ""

            this.setState({
                boxesArray: boxes
            })
        }
    }
    async handleBtnInfo(codigo){
        const respuesta = await axios.get(`${process.env.REACT_APP_APIURL}api/boxes/${codigo}`, { withCredentials: true })
        const box = await respuesta.data
        const productosBox = box.content
        const prodArray = productosBox.map((prod, index) => {
            if (index === 0) {
              return `<h2>${prod.product.nombre}</h2>`;
            } else {
              return `<h3>+ ${prod.product.nombre}</h3>`;
            }
        });
        const productListHTML = prodArray.join('')
        for(let prod of productosBox){
            prodArray.push(prod.product.nombre)
        }
        Swal.fire({
            html: `
            <div className="popup">
                <img src="${box.img}">
                <div className="productList">
                    ${productListHTML}
                </div>
            </div>
            `,
            showCloseButton: true,
            showDenyButton: false,
            confirmButtonColor: '#9ebc4a',
            confirmButtonText: 'Cerrar',
        })
    }
    render() {
        return(
        <section className="d-md-flex flex-row" id="filtros">
        {this.state.isLoading ? <Loader/> : null}
        <Accordion defaultActiveKey={['0']} alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header><h2>Filtros</h2></Accordion.Header>
                <Accordion.Body>
                <div>
                    <div>
                        <div>
                            <div>
                                <button className="buttn" id="bReset">Restablecer filtros</button>
                            </div>
                            <div>
                                <button className="buttn" id="bFiltros">Aplicar filtros</button>
                            </div>
                            <h3>Tipo de box</h3>
                            <ul>
                                <li>
                                    <input type="radio" name="tipo" value="madera" />
                                    Caja de madera
                                </li>
                                <li>
                                    <input type="radio" name="tipo" value="carton" />
                                    Caja de cartón
                                </li>
                                <li>
                                    <input type="radio" name="tipo" value="bolsa" />
                                    Bolsa de cartón
                                </li>
                            </ul>
                            <h3>Tamaño</h3>
                            <ul>
                                <li>
                                    <input type="radio" name="tam" value="simple" />
                                    Simple
                                </li>
                                <li>
                                    <input type="radio" name="tam" value="doble" />
                                    Doble
                                </li>
                            </ul>
                            <div>
                                <h3>Con delicatessen</h3>
                                <input type="radio" name="del" value="deli" className="mx-3" id="deliCheckbox"/>
                            </div>
                        </div>
                    </div>
                </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
        <div className="row m-1">
            {this.state.boxesArray.map(box=>{
                return(
                <div className='col-6 col-md-4 p-0' key={box.codigo}>
                    <div className="cCard mx-1 mb-1">
                        <a className="buttn btnInfo" onClick={()=> this.handleBtnInfo(box.codigo)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-info" viewBox="0 0 16 16">
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                        </a>
                        <h3 className="mt-2">BOX {box.codigo}</h3>
                        <img src={box.img} alt="..." />
                        <h4>${box.precio}</h4>
                        <ItemCount bid={box.codigo}/>
                    </div>
                </div>
                )
            })}
        </div>
        </section>
        )
        
    }
}

export default FilteredBoxes