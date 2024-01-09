import React from "react";

function EnviosBrand(){
    // setTimeout(() => {
    //     const section = document.getElementById("containerMap")
    //     section.classList.remove("d-none")
    // }, 500);

    return(
        <section id="containerMap">
            <div id="cmColumn">
            <div>
                    <img src="img/ubi1.webp" alt="Nos encontramos en Almagro. A dos cuadras de la estación Medrano, línea B"></img>
                </div>
                <div>
                    <img src="img/ubi2.webp" alt="Envíos a CABA y GBA"></img>
                </div>
            </div>
            <div id="cmIframe">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0510908801734!2d-58.42180405882871!3d-34.6028695598843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca63d00e34f3%3A0x5e9a62e559d5554e!2sMedrano!5e0!3m2!1ses-419!2sar!4v1675537559513!5m2!1ses-419!2sar" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </section>
    )
}

export default EnviosBrand