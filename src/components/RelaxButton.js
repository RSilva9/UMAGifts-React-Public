import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function RelaxButton({ handleShowRelaxChange }) {
  const [showGif, setShowGif] = useState(false)
  const [showRelax, setShowRelax] = useState(false)
  const location = useLocation();


  const handleCheckboxChange = (evt) => {
    setShowRelax(evt.target.checked)
    handleShowRelaxChange(evt.target.checked);
    const liquid = document.getElementById("liquidTransition")
    const image = new Image()
    image.src = "img/liquid.gif"

    if (!showGif) {
        const liquid = document.getElementById("liquidTransition")
        const image = new Image()
        image.src = `img/liquid.gif?${Date.now()}`
      
        liquid.classList.remove("d-none")
        liquid.classList.add("d-block")
        liquid.setAttribute("src", image.src)

        setShowGif(true)
      
        setTimeout(() => {
          liquid.classList.remove("d-block")
          liquid.classList.add("d-none")
          liquid.removeAttribute("src")
          setShowGif(false);
        }, 3000);
    }
  };

  return (
    <div>
      <div id='btnRelax'>
        <div>
          <img src='img/relax/UMA_Relax.webp' alt="Relax" />
        </div>
        <div className='w-100 d-flex'>
          <label className="switch" htmlFor="checkbox">
            <input type="checkbox" id="checkbox" onChange={(evt)=> handleCheckboxChange(evt)}/>
            <div className="slider round"></div>
          </label>
        </div>
      </div>
      <img
        id="liquidTransition"
        className="d-none"
        alt="Liquid Transition"
      />
    </div>
  );
}

export default RelaxButton;