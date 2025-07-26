import React from "react";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "../css/SliderComponent.css"; // Correct file path
import withAutoplay from "react-awesome-slider/dist/autoplay";
import Assets from "../../../Asset/Assets";

const SliderComponent = () => {
  const AutoplaySlider = withAutoplay(AwesomeSlider);

  // Define an array of images for easy mapping
  const sliderImages = [Assets.AD1, Assets.AD3,Assets.AD4];

  return (
    <AutoplaySlider
      className="custom-slider"
      play={true}
      cancelOnInteraction={false}
      interval={3000}
      buttons={false}
      bullets={false}
    >
      {sliderImages.map((image, index) => (
        <div key={index} className="slide">
          <img src={image} alt={`Slide ${index + 1}`} className="slider-img" />
        </div>
      ))}
    </AutoplaySlider>
  );
};

export default SliderComponent;
