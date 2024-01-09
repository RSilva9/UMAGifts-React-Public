import { Carousel } from "react-bootstrap";
import { Loader } from "./Loader.js"
import React, { useContext, useEffect, useState } from 'react'
import siteContext from './siteContext.js';

const BoxCarousel = () => {
    const { boxes } = useContext(siteContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(false)
    }, [])

    const sliceBoxes = (start, end) => {
        return boxes.slice(start, end).map(box => (
            <img src={box.imgbg} key={box.codigo} alt={`Box ${box.codigo}`} />
        ))
    };

    return (
        <div>
            {isLoading && <Loader />}
            <Carousel indicators={false} id="boxCarousel">
                <Carousel.Item>
                    <div className="d-flex flex-column flex-md-row align-items-center px-5">
                        <div className="cell">{sliceBoxes(0, 2)}</div>
                        <div className="cell">{sliceBoxes(3, 5)}</div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="d-flex flex-column flex-md-row align-items-center px-5">
                        <div className="cell">{sliceBoxes(7, 9)}</div>
                        <div className="cell">{sliceBoxes(11, 13)}</div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="d-flex flex-column flex-md-row align-items-center px-5">
                        <div className="cell">{sliceBoxes(15, 17)}</div>
                        <div className="cell">{sliceBoxes(18, 20)}</div>
                    </div>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default BoxCarousel