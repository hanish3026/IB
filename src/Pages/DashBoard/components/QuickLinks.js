import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaExchangeAlt, 
  FaCreditCard, 
  FaUserCog, 
  FaHistory,
  FaFileInvoice,
  FaBell,
  FaPiggyBank,
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';
import '../css/QuickLinks.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';

const QuickLinks = () => {
  const { t } = useTranslation('dashboard');
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out'
    });
  }, []);

  const quickLinks = [
    {
      title: t('fundTransfer'),
      description: t('sendMoneyInstantly'),
      icon: <FaExchangeAlt />,
      path: '/transfer',
      color: '#4CAF50'
    },  
    {
      title: t('cards'),
      description: t('manageYourCards'),
      icon: <FaCreditCard />,
      path: '/cards',
      color: '#2196F3'
    },
    {
      title: t('profile'),
      description: t('updateYourDetails'),
      icon: <FaUserCog />,
      path: '/profile',
      color: '#9C27B0'
    },
    {
      title: t('transactions'),
      description: t('viewYourHistory'),
      icon: <FaHistory />,
      path: '/transactions',
      color: '#FF9800'
    },
    {
      title: t('billsPayments'),
      description: t('payYourBillsEasily'),
      icon: <FaFileInvoice />,
      path: '/billpay',
      color: '#E91E63'
    },
    {
      title: t('deposits'),
      description: t('growYourSavings'),
      icon: <FaPiggyBank />,
      path: '/transfer',
      color: '#795548'
    }
  ];

  return (
    <div className="quick-links-container" data-aos="fade-up">
      <div className="quick-links-header">
        <div className="header-text">
          <h2>{t('quickAccess')}</h2>
          <span className="subtitle">{t('frequentlyUsedBankingServices')}</span>
        </div>
        {/* <Link to="/services" className="view-all-link">
          View All <FaArrowRight className="arrow-icon" />
        </Link> */}
      </div>
      
      <div className="quick-links-grid">
        {quickLinks.map((link, index) => (
          <Link 
            to={link.path} 
            key={index} 
            className="quick-link-card"
            style={{ '--hover-color': link.color, '--animation-order': index }}
            data-aos="fade-up"
            data-aos-delay={100 + (index * 50)}
          >
            <div className="quick-link-content">
              <div className="quick-link-icon" style={{ backgroundColor: link.color }}>
                {link.icon}
              </div>
              <div className="quick-link-text">
                <span className="quick-link-title">{link.title}</span>
                <span className="quick-link-description">{link.description}</span>
              </div>
            </div>
            <div className="quick-link-arrow">
              <FaArrowRight />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;