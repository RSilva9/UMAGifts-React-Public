import React from "react";
import { Link } from "react-router-dom";

function Footer(){
    return(
    <footer>
        <section className="d-flex flex-column">
            <h3>Navegación</h3>
            <Link to="/" active="false">Inicio</Link>
            <Link to="/box-prearmadas" active="false">BOX prearmadas</Link>
            <Link to="/arma-tu-box" active="false">Armá tu BOX</Link>
            <Link to="/productos" active="false">Productos</Link>
            <Link to="/carrito" active="false">Carrito</Link>
        </section>
        <section className="d-flex flex-column">
            <h3>Contacto</h3>
            <div className="d-flex">
                <img src="img/icons/whatsappWhite.webp" alt="logo WhatsApp" className="my-auto" />
                <a href="https:/https://umagiftsapi.onrender.com/api.whatsapp.com/send/?phone=5491132088347&text=Hola,%20quiero%20realizar%20una%20consulta&type=phone_number&app_absent=0"
                    className="my-auto">WhatsApp</a>
            </div>
            <div className="d-flex">
                <img src="img/icons/phoneWhite.webp" alt="logo teléfono" className="my-auto" />
                <p className="my-auto">+54 9 11 3208-8347</p>
            </div>
        </section>
        <section className="d-flex flex-column">
            <h3>Redes Sociales</h3>
            <div className="d-flex">
                <img src="img/icons/instagramWhite.webp" alt="logo Instagram" className="my-auto" />
                <a href="https://www.instagram.com/uma.gifts/" className="my-auto">Instagram</a>
            </div>
            <div className="d-flex">
                <img src="img/icons/facebookWhite.webp" alt="logo Facebook" className="my-auto" />
                <a href="https://www.facebook.com/umagiftsfb/" className="my-auto">Facebook</a>
            </div>
        </section>
    </footer>
    )
}

export default Footer