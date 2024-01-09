import React from 'react'

function WhatsappButton(){
    return(
        <a id="btnWhatsapp" href="https://api.whatsapp.com/send/?phone=5491132088347&text=Hola,%20quiero%20realizar%20una%20consulta&type=phone_number&app_absent=0" target='_blank'>
            <img src="img/icons/whatsappWhite.webp" alt="Botón de Whatsapp" />
        </a>
    )
}

export default WhatsappButton