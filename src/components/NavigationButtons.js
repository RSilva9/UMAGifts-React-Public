import React from "react";
import { Link } from "react-router-dom";

function NavigationButtons(){
    return(
        <section id="botonesIndex">
            <Link to={'/arma-tu-box'} id="b1">
                <h2 className="text-center">Armá tu BOX</h2>
            </Link>
            <Link to={'/box-prearmadas'} id="b2">
                <h2 className="text-center">BOX prearmadas</h2>
            </Link>
            <Link to={'/productos'} id="b3">
                <h2 className="text-center">Todos nuestros productos</h2>
            </Link>
        </section>
    )
}

export default NavigationButtons