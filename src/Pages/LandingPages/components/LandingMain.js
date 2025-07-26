import React, { useEffect } from "react";
import "../css/LandingMain.css";
import Assets from "../../../Asset/Assets";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingMain = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, delay: 100 });
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Left Section */}
        <div className="landing-image-section" data-aos="fade-right">
          <img src={Assets.laptops} className="main-image" alt="Banking Platform" />
        </div>

        {/* Right Section */}
        <div className="landing-text-section">
          <div className="text-content">
            <h1 className="main-title" data-aos="fade-up">
              Banking Made For <span className="highlight">Everyone</span>
            </h1>
            <div className="description" data-aos="fade-up" data-aos-delay="200">
              <p>Experience banking that fits your lifestyle, anytime, anywhere.</p>
              <p>Designed to meet your needs, whether on-the-go or at home.</p>
            </div>
            <div className="cta-buttons" data-aos="fade-up" data-aos-delay="400">
              <button className="primary-button">Get Started</button>
              <button className="secondary-button">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingMain;
