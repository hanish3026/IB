import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import Assets from "../../../Asset/Assets";
import "../css/DashboardCard.css";
import { useTranslation } from 'react-i18next';

const DashboardCards = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [balance, setBalance] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentCard, setCurrentCard] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // AOS.init({
    //   duration: 800,
    //   once: false,
    //   mirror: true
    // });
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleShowBalance = () => setBalance(!balance);
  const handleTransfer = () => navigate("/transfer");
  const handleBillPay = () => navigate("/billpay");

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Mobile combined card
  const renderMobileSummaryCard = () => {
    return (
      <div className="dashboard-card mobile-summary-card">
        <div className="dashboard-card-content">
          {/* Profile Section */}
          <div className="mobile-profile-section">
            <div className="d-flex align-items-center gap-3">
              <img
                src={Assets.profile}
                className="rounded-circle"
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  border: "3px solid rgba(255, 255, 255, 0.1)"
                }}
              />
              <div>
                <h5 className="mb-0">{t('welcome')}, Hanish</h5>
                <div className="d-flex align-items-center gap-2">
                  <div className="security-badge">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <small style={{ color: 'var(--dashboard-success)' }}>{t('protected')}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Section */}
          <div className="mobile-balance-section">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="dashboard-label mb-0">{t('totalBalance')}</h6>
              <div className="dashboard-stat-icon balance-eye" onClick={handleShowBalance}>
                <i className={`fa-solid fa-eye${balance ? '-slash' : ''}`}></i>
              </div>
            </div>

            <h2 className={balance ? "dashboard-balance-amount" : "dashboard-balance-blur"}>
              TZS 3,34,515
            </h2>

            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="fa-solid fa-arrow-trend-up" style={{ color: 'var(--dashboard-success)' }}></i>
              <small style={{ color: 'var(--dashboard-success)' }}>+TZS 5,000 {t('thisMonth')}</small>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mobile-quick-actions">
            <div className="action-button" onClick={handleTransfer}>
              <i className="fa-solid fa-paper-plane"></i>
              <span>Send</span>
            </div>
            <div className="action-button" onClick={handleBillPay}>
              <i className="fa-solid fa-receipt"></i>
              <span>Pay Bills</span>
            </div>
            <div className="action-button" onClick={() => navigate("/cards")}>
              <i className="fa-solid fa-credit-card"></i>
              <span>Cards</span>
            </div>
            <div className="action-button" onClick={() => navigate("/profile")}>
              <i className="fa-solid fa-user-pen"></i>
              <span>Profile</span>
            </div>
          </div>

          {/* Card Usage */}
          <div className="mobile-card-usage">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="dashboard-label">Card Usage</h6>
              <small className="dashboard-label">65% used</small>
            </div>
            <div className="dashboard-progress">
              <div className="dashboard-progress-bar" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Next Payment */}
          <div className="mobile-next-payment mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-calendar-day"></i>
                <div>
                  <small className="dashboard-label">Next Payment</small>
                  <p className="mb-0">Due {formatDate(new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000))}</p>
                </div>
              </div>
              <span className="next-payment-amount">TZS 10,000</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCard = (type) => {
    switch(type) {
      case 'balance':
        return (
          <div className="dashboard-card dashboard-balance-card">
            <div className="dashboard-card-content">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="dashboard-label mb-0">{t('totalBalance')}</h5>
                <div className="dashboard-stat-icon" onClick={handleShowBalance}>
                  <i className={`fa-solid fa-eye${balance ? '-slash' : ''}`}></i>
                </div>
              </div>

              <h2 className={balance ? "dashboard-balance-amount" : "dashboard-balance-blur"}>
                TZS 3,34,515
              </h2>

              <div className="dashboard-stat">
                <div className="dashboard-stat-icon">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                </div>
                <div>
                  <p className="mb-0" style={{ color: 'var(--dashboard-success)' }}>+TZS 5,000</p>
                  <small className="dashboard-label">{t('thisMonth')}</small>
                </div>
              </div>

              <div className="dashboard-quick-actions">
                <div className="dashboard-quick-action" onClick={handleTransfer}>
                  <i className="fa-solid fa-paper-plane"></i>
                  <p className="mb-0">{t('send')}</p>
                </div>
                <div className="dashboard-quick-action" onClick={handleBillPay}>
                  <i className="fa-solid fa-receipt"></i>
                  <p className="mb-0">{t('payBills')}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <div className="text-center mb-3">
                <img
                  src={Assets.profile}
                  className="rounded-circle mb-3"
                  alt="Profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border: "4px solid rgba(255, 255, 255, 0.1)"
                  }}
                />
                <h5 className="dashboard-label">{t('welcome')}, Hanish</h5>
              </div>

              <div className="dashboard-stat">
                <div className="dashboard-stat-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="flex-grow-1">
                  <small className="dashboard-label">{t('securityStatus')}</small>
                  <p className="mb-0" style={{ color: 'var(--dashboard-success)' }}>{t('protected')}</p>
                </div>
              </div>

              <button className="dashboard-action-btn w-100 mt-3" onClick={() => navigate("/profile")}>
                <i className="fa-solid fa-user-pen me-2"></i>
                {t('manageProfile')}
              </button>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <h5 className="dashboard-label mb-3">{t('cardUsage')}</h5>
              
              <div className="dashboard-stat">
                <div className="dashboard-stat-icon">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">{t('creditCard')}</p>
                  <div className="dashboard-progress mt-2">
                    <div className="dashboard-progress-bar" style={{ width: '65%' }}></div>
                  </div>
                  <small className="dashboard-label">{t('limitUsed')}</small>
                </div>
              </div>

              <div className="dashboard-stat">
                <div className="dashboard-stat-icon">
                  <i className="fa-solid fa-calendar-day"></i>
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">{t('nextPayment')}</p>
                  <small className="dashboard-label">
                    Due {formatDate(new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000))}
                  </small>
                </div>
                <span className="dashboard-label">TZS 10,000</span>
              </div>

              <button className="dashboard-action-btn w-100 mt-3" onClick={() => navigate("/cards")}>
                <i className="fa-solid fa-credit-card me-2"></i>
                {t('manageCards')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const cards = ['balance', 'profile', 'activity'];

  const nextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentCard((prev) => (prev + 1) % cards.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Determine if we're on tablet (between 769px and 1024px)
  const isTablet = windowWidth <= 1024 && windowWidth > 768;
  // Determine if we're on mobile (768px or less)
  const isMobile = windowWidth <= 768;

  return (
    <div className="dashboard-main">
      {windowWidth > 768 ? (
        <>
          {isTablet && (
            <div className="dashboard-scroll-indicator">
              <small><i className="fa-solid fa-arrows-left-right me-2"></i> Scroll to see more</small>
            </div>
          )}
          <div className="dashboard-layout">
            <div className="dashboard-main">
              {cards.map((type, index) => (
                <div key={index} className="dashboard-card-wrapper">
                  {renderCard(type)}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mobile Summary Card */}
          <div className="mobile-summary-wrapper">
            {renderMobileSummaryCard()}
          </div>
          
          {/* Original Mobile Card Carousel */}
          <div className="mobile-card-container" style={{ display: 'none' }}>
            {currentCard > 0 && (
              <button className="card-nav-btn prev" onClick={prevCard} aria-label="Previous card">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}
            
            <div className={`dashboard-card-wrapper ${isAnimating ? 'card-slide-in' : ''}`}>
              {renderCard(cards[currentCard])}
            </div>

            {currentCard < cards.length - 1 && (
              <button className="card-nav-btn next" onClick={nextCard} aria-label="Next card">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}
            
            <div className="card-indicators">
              {cards.map((_, index) => (
                <span 
                  key={index} 
                  className={`indicator ${currentCard === index ? 'active' : ''}`}
                  onClick={() => {
                    if (currentCard !== index && !isAnimating) {
                      setIsAnimating(true);
                      setCurrentCard(index);
                      setTimeout(() => setIsAnimating(false), 300);
                    }
                  }}
                  role="button"
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCards;
