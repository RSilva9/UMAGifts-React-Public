import { Carousel } from "react-bootstrap";

function MainCarousel() {
    return (
      <Carousel indicators={false} controls={false}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/img/carousel/carousel1.webp"
            alt="Foto carousel: Cinco BOX prearmadas y la frase: Regalá distinto, regalá una BOX."
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/img/carousel/carousel2.webp"
            alt="Foto carousel: Armá tu propia BOX como desees."
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/img/carousel/carousel3.webp"
            alt="Foto carousel: Botella de vino con un regalo y la frase: Disfrutá regalar"
          />
        </Carousel.Item>
      </Carousel>
    );
  }

  export default MainCarousel