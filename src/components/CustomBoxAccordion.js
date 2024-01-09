import React, { useState, useEffect } from 'react'
import { Loader } from "./Loader.js"
import axios from 'axios';
import Swal from "sweetalert2";
import Randomstring from 'randomstring';
import siteContext from './siteContext.js'

class CustomBoxAccordion extends React.Component {
    static contextType = siteContext
    constructor(props) {
        super(props);
        this.state = {
            estuches: [],
            botellas: [],
            delis: [],
            customBox:{
                estuche: "",
                botellas: [],
                delis: [],
                precio: 0,
                id: ""
            },
            isLoading: true
        };
    }
    async componentDidMount() {
        const products = this.context.products
        const estuches = []
        const botellas = []
        const delis = []

        for(let prod of products){
            if(prod.tipo == "estuche"){ 
                estuches.push(prod)
            }else if(prod.tipo == "bebida"){ 
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

        const cbc2 = document.getElementById("customBoxContainer-item2")
        const cbc3 = document.getElementById("customBoxContainer-item3")
        const btnEnd = document.getElementById("btnEnd")
        btnEnd.onclick = ()=>{
            handleFinishBox()
        }
        
        let estInputs, botInputs, delInputs;
        const maxSize = 34
        let suma = 0, deliSuma=0, precioEstuche = 0, precioBotellas = 0, precioDelis = 0, maxBotellas = 0
        let selEstuche
        let botArray = [], deliArray = []

        setTimeout(() => {
            estInputs = document.getElementsByName("estuche")
            botInputs = document.getElementsByName("botella")
            delInputs = document.getElementsByName("deli")
            addEL(estInputs)
            addEL(botInputs)
            addEL(delInputs)
        }, 100);

        const addEL = (inputs) =>{
            for(let input of inputs){
                input.addEventListener("change", ()=>{
                    if(input.checked){
                        input.parentElement.classList.add("selectedCard")
                        const cardData = JSON.parse(input.dataset.info)

                        switch (input.name) {
                            case "estuche":
                                if(cardData.tam == "simple"){
                                    for(let bot of botInputs){
                                        bot.type = "radio"
                                        bot.checked = false
                                        this.unchecker(botInputs)
                                    }
                                    maxBotellas = 1
                                }else{
                                    for(let bot of botInputs){
                                        bot.type = "checkbox"
                                        bot.checked = false
                                        this.unchecker(botInputs)
                                    }
                                    maxBotellas = 2
                                }
                                cbc2.classList.remove("d-none")
                                cbc2.classList.add("animate__slideInLeft")
                                cbc2.scrollIntoView({ behavior: "smooth" });
                                cbc3.classList.add("d-none")
                                reset("all")
                                precioEstuche = cardData.precio
                                selEstuche = cardData.nombre
                                break;
                            case "botella":
                                if(input.type == "checkbox"){
                                    if(suma!=maxBotellas){
                                        suma++
                                        input.parentElement.classList.add("selectedCard")
                                        botArray.push({nombre: cardData.nombre})
                                        precioBotellas += cardData.precio
                                    }else{
                                        input.checked = false
                                        this.unchecker(botInputs)
                                    }
                                    if(suma == maxBotellas){
                                        cbc3.classList.add("d-none")
                                        reset("delis")
                                    }else if(suma == 1){
                                        cbc3.classList.remove("d-none")
                                        cbc3.classList.add("animate__slideInLeft")
                                    }
                                }else{
                                    if(suma!=maxBotellas) suma++
                                    input.parentElement.classList.add("selectedCard")
                                    botArray = [{nombre: cardData.nombre}]
                                    precioBotellas = cardData.precio
                                }
                            break;
                            case "deli":
                                if(deliSuma+cardData.size < maxSize){
                                    deliSuma += cardData.size
                                    deliArray.push({nombre: cardData.nombre})
                                    precioDelis += cardData.precio
                                }else{
                                    input.checked = false
                                    this.unchecker(botInputs)
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'No hay espacio en la BOX para este producto',
                                        text: 'Seleccione o reemplacelo por otro',
                                    })
                                }
                            break;
                            default:
                                break;
                        }
                        if(deliSuma >= 28 || suma == maxBotellas){
                            handleEndVisibility("show")
                        }
                    }else if(!input.checked){
                        const cardData = JSON.parse(input.dataset.info)

                        switch (input.name) {
                            case "botella":
                                if(input.type == "checkbox"){
                                    input.parentElement.classList.remove("selectedCard")

                                    const newArray = botArray.filter(item=> item.nombre !== cardData.nombre)
                                    botArray = newArray

                                    input.checked = false
                                    suma--
                                    precioBotellas -= cardData.precio
                                    this.unchecker(botInputs)

                                    if(suma == 0){
                                        cbc3.classList.add("d-none")
                                        reset("delis")
                                    }else if(suma == 1){
                                        cbc3.classList.remove("d-none")
                                    }
                                }
                            break;
                            case "deli":
                                input.parentElement.classList.remove("selectedCard")

                                const newArray = deliArray.filter(item=> item.nombre !== cardData.nombre)
                                deliArray = newArray

                                input.checked = false
                                deliSuma -= cardData.size
                                precioDelis -= cardData.precio
                                this.unchecker(delInputs)
                            break;
                            default:
                                break;
                        }
                        if(!(deliSuma >= 28) || !(suma == maxBotellas)){
                            handleEndVisibility("hide")
                        }
                    }
                    this.unchecker(inputs)
                })
            }
        }
        const handleFinishBox = ()=>{
            let newPrice = precioEstuche + precioBotellas + precioDelis
            this.setState({
                customBox:{
                    estuche: selEstuche,
                    botellas: botArray,
                    delis: deliArray,
                    precio: newPrice,
                    id: Randomstring.generate(8)
                }
            })
           
            setTimeout(() => {
                const fireSwal = async()=>{
                    const {value: cantidad} = await Swal.fire({
                        title: '¿Cuántas BOX querés agregar al carrito?',
                        html: `<h3>Precio final de tu BOX: $${this.state.customBox.precio}</h3>`,
                        input: 'number',
                        confirmButtonColor: '#9ebc4a',
                        confirmButtonText: 'Agregar al carrito',
                        inputValidator: (value) => {
                            if (!value || value <= 0) {
                                return 'Indicá una cantidad válida.'
                            }
                        }
                    })
                    if(cantidad){
                        const user = this.context.contextUser
                        if(user.cartId){
                            const result = await axios({
                                method: 'put',
                                url: `${process.env.REACT_APP_APIURL}api/carts/addCustomBoxToCart/${cantidad}`,
                                withCredentials: true,
                                data: this.state.customBox
                            })
                        }else{
                            const newCustomBox = {
                                products: this.state.customBox,
                                quantity: Number(cantidad)
                            }
                            let localCustomBoxArray = JSON.parse(localStorage.getItem("customBoxes")) || []
                            localCustomBoxArray.push(newCustomBox)
                            localStorage.setItem("customBoxes", JSON.stringify(localCustomBoxArray))
                        }
    
                        Swal.fire({
                            icon: 'success',
                            confirmButtonColor: '#9ebc4a',
                            denyButtonColor: '#7c3359',
                            confirmButtonText: 'Seguir comprando',
                            denyButtonText: 'Ir al carrito',
                            showDenyButton: true,
                            title: `Agregaste ${cantidad} BOX al carrito`,
                        }).then((result)=>{
                            if(result.isConfirmed || result.dismiss){
                                window.location.reload()
                            }else{
                                window.location = "carrito"
                            }
                        })
                    }
                }
                fireSwal()
            }, 100);
        }
        const reset = (type)=>{
            if(type == "all"){
                precioBotellas = 0
                precioDelis = 0
                deliSuma = 0
                suma = 0
                botArray = []
                deliArray = []
                for(let del of delInputs){
                    del.checked = false
                    this.unchecker(delInputs)
                }
                for(let bot of botInputs){
                    bot.checked = false
                    this.unchecker(botInputs)
                }
                handleEndVisibility("hide")
            }else if(type == "delis"){
                precioDelis = 0
                deliSuma = 0
                deliArray = []
                for(let del of delInputs){
                    del.checked = false
                    this.unchecker(delInputs)
                }
            }
        }
        const handleEndVisibility = (state)=>{
            if(state == "show"){
                btnEnd.classList.remove("d-none")
                btnEnd.classList.remove("animate__bounceOut")
                btnEnd.classList.add("animate__bounceIn")
            }else{
                btnEnd.classList.remove("animate__bounceIn")
                btnEnd.classList.add("animate__bounceOut")
            }
        }
    }
    unchecker(inputs){
        for(let input of inputs){
            if(!(input.checked)){
                input.parentElement.classList.remove("selectedCard")
            }
        }
    }

    render() {
        return (
            <section id="customBoxContainer">
                {this.state.isLoading ? <Loader/> : null}
                <div id="customBoxContainer-item1">
                    <div className="brand">
                        <h2>Tipo de estuche</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.estuches.map(est=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={est.codigo}>
                                    <input type="radio" className="stretched-link" name="estuche" data-info={JSON.stringify(est)}/>
                                    <img src={est.img} alt="..." />
                                    <h2>{est.nombre}</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="d-none animate__animated" id="customBoxContainer-item2">
                    <div className="brand">
                        <h2>Vino o espumante</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.botellas.map(bot=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={bot.codigo}>
                                    <input type="checkbox" className="stretched-link" name="botella" data-info={JSON.stringify(bot)}/>
                                    <img src={bot.img} alt="..." />
                                    <h2>{bot.nombre}</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="d-none animate__animated" id="customBoxContainer-item3">
                    <div className="brand">
                        <h2>Delicatessen</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.delis.map(del=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={del.codigo}>
                                    <input type="checkbox" className="stretched-link" name="deli" data-info={JSON.stringify(del)}/>
                                    <img src={del.img} alt="..." />
                                    <h2>{del.nombre}</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="d-none text-center fixed-bottom mb-5 animate__animated" id="btnEnd">
                    <button className="buttn">Terminar caja</button>
                </div>
            </section>
            
        );
    }
}

export default CustomBoxAccordion