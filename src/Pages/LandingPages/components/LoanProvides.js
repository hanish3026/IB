import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingUsd,
  faHome,
  faCreditCard,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import Aos from "aos";
import "aos/dist/aos.css";
import "../css/LoanProvides.css"; // Import CSS

const LoanProvides = () => {
  const [flipped, setFlipped] = useState(null);

  useEffect(() => {
    Aos.init({ duration: 800, once: true });
  }, []);

  const loans = [
    { id: 1, title: "Deposit", icon: faHandHoldingUsd, content: "Manage savings and fixed deposits." },
    { id: 2, title: "Credit", icon: faHome, content: "Flexible credit solutions." },
    { id: 3, title: "Trade", icon: faCreditCard, content: "Secure trade finance services." },
    { id: 4, title: "Digital", icon: faMobileAlt, content: "Easy online banking access." },
    { id: 5, title: "Wealth", icon: faHome, content: "Smart investment strategies." },
    { id: 6, title: "Microfinance", icon: faCreditCard, content: "Support for small businesses." },
    { id: 7, title: "Agency", icon: faMobileAlt, content: "Banking through authorized agents." },
    { id: 8, title: "Loans", icon: faHandHoldingUsd, content: "Personal, home & business loans." },
  ];

  const toggleFlip = (id) => {
    setFlipped(flipped === id ? null : id);
  };

  return (
    <div className="loan-container">
      <div className="loan-section">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className={`loan-card ${flipped === loan.id ? "flipped" : ""}`}
            onClick={() => toggleFlip(loan.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <FontAwesomeIcon icon={loan.icon} className="loan-icon" />
                <h3 className="loan-title">{loan.title}</h3>
              </div>
              <div className="card-back">
                <p className="loan-content">{loan.content}</p>
                <button className="loan-button" onClick={() => toggleFlip(loan.id)}>
                  {flipped === loan.id ? "Back" : "More"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanProvides;
