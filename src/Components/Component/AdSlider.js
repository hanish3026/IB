import React, { useState, useEffect } from 'react';
import '../css/AdSlider.css';
import Assets from '../../Asset/Assets';

const AdSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const ads = [
    {
      id: 1,
      title: "Special Home Loan Offer",
      description: "Get up to TZS  50 Lakhs at 8.5% interest rate",
      buttonText: "Apply Now",
      image: Assets.AD1,
      backgroundColor: "#0F2655"
    },
    {
      id: 2,
      title: "Zero Balance Savings Account",
      description: "Open a savings account with zero balance maintenance",
      buttonText: "Learn More",
      image: Assets.AD1,
      backgroundColor: "#0F2655"
    },
    {
      id: 3,
      title: "Credit Card Rewards",
      description: "Earn 5X rewards on all your purchases",
      buttonText: "Get Started",
      image: Assets.AD1,
      backgroundColor: "#0F2655"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === ads.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [ads.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === ads.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? ads.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="ad-slider">
      <div className="slider-container">
        {ads.map((ad, index) => (
          <div 
            key={ad.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ 
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              background: ad.backgroundColor
            }}
          >
            <div className="slide-content">
              <div className="slide-text">
                <h2>{ad.title}</h2>
                <p>{ad.description}</p>
                <button className="slide-button">
                  {ad.buttonText}
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
              <div className="slide-image">
                <img src={ad.image} alt={ad.title} />
              </div>
            </div>
          </div>
        ))}

        <button className="slider-nav prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="slider-nav next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="slider-dots">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdSlider;
