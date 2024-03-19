import React, { useState, useEffect, useContext } from 'react';
import { Carousel, Image } from "react-bootstrap";
import siteContext from './siteContext.js';
import Swal from 'sweetalert2';
import axios from 'axios';

function RelaxSite() {
  const [finishedBox, setFinishedBox] = useState(null)
  const { contextUser: user } = useContext(siteContext)

  const handleFinishBox = ()=>{
    setTimeout(() => {
      const products = document.getElementsByClassName("active")
      var boxPrice
      if(products[4].children[1].innerHTML == "Sin esponja"){
        boxPrice = 17579
      }else{
        boxPrice = 18794
      }
      const finished = {
        jabon: products[1].children[1].innerHTML,
        vela: "Vela aromática de soja",
        sales: products[2].children[1].innerHTML,
        homeSpray: products[3].children[1].innerHTML,
        esponja: products[4].children[1].innerHTML
      }
      const fireSwal = async()=>{
        const {value: cantidad} = await Swal.fire({
            title: '¿Cuántas BOX querés agregar al carrito?',
            html: `<h3>Precio final de tu BOX: $${boxPrice}</h3>`,
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
            if(user.cartId){
                const newRelaxBox = {
                  finished,
                  precio: boxPrice,
                }
                const result = await axios({
                    method: 'put',
                    url: `${process.env.REACT_APP_APIURL}api/carts/addRelaxBoxToCart/${cantidad}`,
                    withCredentials: true,
                    data: newRelaxBox
                })
            }else{
                const newRelaxBox = {
                    products: finished,
                    precio: boxPrice,
                    quantity: Number(cantidad)
                }
                let localRelaxBoxArray = JSON.parse(localStorage.getItem("relaxBoxes")) || []
                localRelaxBoxArray.push(newRelaxBox)
                localStorage.setItem("relaxBoxes", JSON.stringify(localRelaxBoxArray))
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
                    //window.location.reload()
                }else{
                    window.location = "carrito"
                }
            })
        }
      }
      fireSwal()
    }, 900);
  }

  const handleSponge = ()=>{
    setTimeout(() => {
      const products = document.getElementsByClassName("active")
      if(products[4].children[1].innerHTML == "Sin esponja"){
        document.getElementById("priceNoSponge").classList.remove("d-none")
        document.getElementById("priceSponge").classList.add("d-none")
      }else{
        document.getElementById("priceNoSponge").classList.add("d-none")
        document.getElementById("priceSponge").classList.remove("d-none")
      }
    }, 1000);
  }

  return (
    <div id='relaxSite'>
      <div className='d-block'>
        <Carousel indicators={false} interval={4000} controls={false}>
          <Carousel.Item>
            <img
              className="d-block"
              src='/img/relax/Azul.webp'
              alt="Box relax con esponja azul."
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src='/img/relax/Blanca.webp'
              alt="Box relax con esponja blanca."
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src='/img/relax/Rosa.webp'
              alt="Box relax con esponja rosa."
            />
          </Carousel.Item>
        </Carousel>
        <h4 className='text-center display-3 bg-white w-50 m-auto mb-3 d-none' id="priceNoSponge">$7870</h4>
        <h4 className='text-center display-3 bg-white w-50 m-auto mb-3' id="priceSponge">$8860</h4>
      </div>
      <div id='relaxSiteButtons'>
        <img src='/img/relax/BoxRelax.webp'/>
        <div>
          <Carousel indicators={false} interval={null}>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/JabonVioleta.webp'
                alt="Jabon artesanal a base de aceite de coco (lavanda con avena)"
              />
              <h3>Jabón Artesanal a base de Aceite de Coco (lavanda con avena)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/JabonAmarillo.webp'
                alt="Jabon artesanal a base de aceite de coco (lemon grass)"
              />
              <h3>Jabón Artesanal a base de Aceite de Coco (lemon grass)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/JabonVioleta.webp'
                alt="Jabon artesanal a base de aceite de coco (uva)"
              />
              <h3>Jabón Artesanal a base de Aceite de Coco (uva)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/JabonNaranja.webp'
                alt="Jabon artesanal a base de aceite de coco (maracuyá)"
              />
              <h3>Jabón Artesanal a base de Aceite de Coco (maracuyá)</h3>
            </Carousel.Item>
          </Carousel>
        </div>
        <div>
          <img src='/img/relax/Vela.webp'/>
          <h3>Vela Aromática de soja</h3>
        </div>
        <div>
          <Carousel indicators={false} interval={null}>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/SalesAmarilla.webp'
                alt="Sales de baño amarillas."
              />
              <h3>Sales Aromáticas de baño (amarillas)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/SalesBlanca.webp'
                alt="Sales de baño blancas."
              />
              <h3>Sales Aromáticas de baño (blancas)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/SalesNaranja.webp'
                alt="Sales de baño naranjas."
              />
              <h3>Sales Aromáticas de baño (naranjas)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/SalesRosa.webp'
                alt="Sales de baño rosas."
              />
              <h3>Sales Aromáticas de baño (rosas)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/SalesVerde.webp'
                alt="Sales de baño verdes."
              />
              <h3>Sales Aromáticas de baño (verdes)</h3>
            </Carousel.Item>
          </Carousel>
        </div>
        <div>
          <Carousel indicators={false} interval={null}>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/Atom.webp'
                alt="Home Spray (vainilla)"
              />
              <h3>Home Spray (vainilla)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src='/img/relax/Atom.webp'
                alt="Home Spray (lavanda)"
              />
              <h3>Home Spray (lavanda)</h3>
            </Carousel.Item>
          </Carousel>
        </div>
        <div>
          <Carousel indicators={false} interval={null} onClick={()=> handleSponge()}>
            <Carousel.Item>
              <img
                className="d-block"
                src="/img/relax/EsponjaAzul.webp"
                alt="Esponja exfoliante azul."
              />
              <h3>Esponja exfoliante (azul)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src="/img/relax/EsponjaRosa.webp"
                alt="Esponja exfoliante rosa."
              />
              <h3>Esponja exfoliante (rosa)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block"
                src="/img/relax/EsponjaBlanca.webp"
                alt="Esponja exfoliante blanca."
              />
              <h3>Esponja exfoliante (blanca)</h3>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-25"
                src="/img/icons/unavailable.webp"
                alt="Sin esponja."
              />
              <h3>Sin esponja</h3>
            </Carousel.Item>
          </Carousel>
        </div>
        <button className='relaxButton' onClick={()=> handleFinishBox()}>Terminar BOX</button>
      </div>
    </div>
  )
}

export default RelaxSite;