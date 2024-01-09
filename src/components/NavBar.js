import { Navbar, Nav, Offcanvas } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import siteContext from './siteContext.js';

function NavAndBrand({style}) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [franjaTop, setFranjaTop] = useState(null)
  const [nav, setNav] = useState(null)
  const [footer, setFooter] = useState(null)

  useEffect(()=>{
    setFranjaTop(document.getElementById("franjaTop"))
    setNav(document.getElementsByClassName("navbar"))
    setFooter(document.querySelector("footer"))
  }, [])

  setTimeout(() => {
    if(franjaTop){
      if (style === "relax") {
        franjaTop.style.backgroundImage = 'url("https://www.umagifts.com.ar/img/relax/arenaAzul.webp")'
        nav[0].style.backgroundColor = "#4d7978"
        footer.style.background = "linear-gradient(180deg, rgba(144,189,188,1) 0%, rgba(51,80,80,1) 100%)"
      } else {
        franjaTop.style.backgroundImage = 'url("https://www.umagifts.com.ar/img/arenaAmarilla.webp")'
        nav[0].style.backgroundColor = "#7c3359"
        footer.style.background = "linear-gradient(0deg, rgba(69,22,51,1) 0%, rgba(105,34,78,1) 100%)"
      }
    }
  }, 100);

  const handleOffcanvasToggle = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const { contextUser: user } = useContext(siteContext)

  return (
    <>
      <div id="franjaTop">
        <Link to="/" className='d-flex'>
          {style == "relax" ? <img className="w-50 m-auto" src="/img/relax/UMA_Relax_SinFondo.webp" /> : <img src="/img/logoUMAv2_sinFondo.png" />}
        </Link>
      </div>

      <Navbar expand="lg">
      <button onClick={handleOffcanvasToggle} className='ms-auto d-md-none'>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-list" viewBox="0 0 16 18">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </button>
      <div className="d-none d-md-flex w-100 p-1">
        <Nav className="navItems">
          <Link to="/" active="false">Inicio</Link>
          <Link to="/box-prearmadas" active="false">BOX prearmadas</Link>
          <Link to="/arma-tu-box" active="false">Armá tu BOX</Link>
          <Link to="/productos" active="false">Productos</Link>
          {user.role == "admin" ? <Link to="/admin" active="false">Panel de administrador</Link> : null}
        </Nav>
        <Nav className='ms-auto'>
          <Link to="/carrito">
            <img src="/img/icons/cartWhite.webp" alt="Carrito de compras" id="cartLogo" />
          </Link>
        </Nav>
      </div>
    </Navbar>

    <Offcanvas show={showOffcanvas} onHide={handleOffcanvasToggle} id="offCanvas" placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menú</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column offcanvasItems">
          <Link to="/" active="false" onClick={handleOffcanvasToggle}>Inicio</Link>
          <Link to="/box-prearmadas" active="false" onClick={handleOffcanvasToggle}>BOX prearmadas</Link>
          <Link to="/arma-tu-box" active="false" onClick={handleOffcanvasToggle}>Armá tu BOX</Link>
          <Link to="/productos" active="false" onClick={handleOffcanvasToggle}>Productos</Link>
          {user.role == "admin" ? <Link to="/admin" active="false" onClick={handleOffcanvasToggle}>Admin</Link> : null}
        </Nav>
        <Nav className='d-flex justify-content-between w-50 my-2'>
          <Link to="/cuenta" active="false" onClick={handleOffcanvasToggle}>Cuenta</Link>
        </Nav>
        <Nav className="ms-auto">
        <Link to="/carrito" onClick={handleOffcanvasToggle}>
            <img src="/img/icons/cartWhite.webp" alt="Carrito de compras" id="cartLogo" />
          </Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
    </>
  );
}

export default NavAndBrand