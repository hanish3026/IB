import React, { useRef, useState } from "react";
import Assets from "../../../Asset/Assets";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/LandingCards.css"; // Add styles here

const LandingCards = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const cards = [
    {
      title: "One View Of All Your Finances",
      text: "View your Accounts, keep track of your Deposits, manage your cards, plan your investments, apply for new loans/cards",
      img: Assets.laptops,
    },
    {
      title: "5 Layers Of Security For Safe Banking",
      text: "Your money is secure with our 5-layer protection, including Behavioural Biometrics and Multi-Factor Authentication.",
      img: Assets.laptops,
    },
    {
      title: "Faster Access To Your Transactions",
      text: "Add your favourite transactions as per your needs on the dashboard to 'My Favourite Links' and access them instantly.",
      img: Assets.laptops,
    },
    {
        title: "One View Of All Your Finances",
        text: "View your Accounts, keep track of your Deposits, manage your cards, plan your investments, apply for new loans/cards",
        img: Assets.laptops,
      },
      {
        title: "5 Layers Of Security For Safe Banking",
        text: "Your money is secure with our 5-layer protection, including Behavioural Biometrics and Multi-Factor Authentication.",
        img: Assets.laptops,
      },
      {
        title: "Faster Access To Your Transactions",
        text: "Add your favourite transactions as per your needs on the dashboard to 'My Favourite Links' and access them instantly.",
        img: Assets.laptops,
      },
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="container">
      <h3 className="Heading my-5">New, Improved and Easier Than Ever</h3>

      {/* Swipeable Cards Container */}
      <div
        className="cards-wrapper"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {cards.map((card, index) => (
          <div className="card-item" key={index}>
            <div className="card shadow">
              <img className="card-img-top" src={card.img} alt={card.title} />
              <div className="card-body">
                <h5 className="card-title card-titles">{card.title}</h5>
                <p className="card-text card-body-style">{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingCards;
