import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaCoins, 
  FaGasPump,
  FaArrowRight
} from "react-icons/fa";
import "../css/InsightsOffers.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';



const InsightsOffers = () => {
  const { t } = useTranslation('dashboard');
  const offers = [
    {
      id: 1,
      title: t('10% Cashback on Grocery'),
      description: t('Get 10% cashback on all grocery purchases'),
      icon: <FaShoppingCart />,
      path: "/offers/cashback", 
      color: "#4CAF50"
    },
    {
      id: 2,
      title: t('Special Loan Offer'),
      description: t('Personal loan at just 7% interest rate'),
      icon: <FaCoins />,
      path: "/offers/loan",
      color: "#2196F3"
    },
    {
      id: 3,
      title: t('Fuel Rewards'),
      description: t('Earn extra points on fuel transactions'),
      icon: <FaGasPump />,
      path: "/offers/fuel",
      color: "#FF9800"
    }
  ];
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out'
    });
  }, []);

  return (
    <div className="insights-offers-container" data-aos="fade-up">
      <div className="insights-offers-header">
        <div className="header-text">
          <h2>{t('exclusiveOffers')}</h2>
          <span className="subtitle">{t('personalizedDealsForYou')}</span>
        </div>
        {/* <Link to="/offers" className="view-all-link">
          View All <FaArrowRight className="arrow-icon" />
        </Link> */}
      </div>
      
      <div className="insights-offers-grid">
        {offers.map((offer, index) => (
          <Link 
            to={offer.path} 
            key={offer.id} 
            className="insight-offer-card"
            style={{ '--hover-color': offer.color, '--animation-order': index }}
            data-aos="fade-up"
            data-aos-delay={100 + (index * 50)}
          >
            <div className="insight-offer-content">
              <div className="insight-offer-icon" style={{ backgroundColor: offer.color }}>
                {offer.icon}
              </div>
              <div className="insight-offer-text">
                <span className="insight-offer-title">{offer.title}</span>
                <span className="insight-offer-description">{offer.description}</span>
              </div>
            </div>
            <div className="insight-offer-arrow">
              <FaArrowRight />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InsightsOffers;