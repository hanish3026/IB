import React, { useState, useEffect } from 'react'
import DashboardCards from '../components/DashboardCards'
import SliderComponent from '../components/SliderComponent'
import InsightsOffers from '../components/InsightsOffers'
import QuickLinks from '../components/QuickLinks'
import '../css/Dashboard.css'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
// import "../../../styles/modules/dashboard.css"
const DashBoard = () => {
  const nav = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation('dashboard');
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('greeting');
    if (hour < 17) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Top Navigation Bar */}
      {/* <nav className="dashboard-nav">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="nav-actions">
          <div className="current-time">
            <FaClock /> {currentTime.toLocaleTimeString()}
          </div>
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <FaUserCircle />
            <span>Hanish</span>
          </div>
        </div>
      </nav> */}

      <div className="">
        {/* User Welcome Section */}
        <section className="welcome-section mx-md-4">
          <div className="welcomes-content">
            <h2 className="greeting">{getGreeting()}, <span style={{ color: "#fff" }}>Hanish</span></h2>
            <p className="last-login">
              <i className="fas fa-clock" style={{ marginRight: "8px" }}></i>
              Last login: {currentTime.toLocaleDateString()} at {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="quick-actions">
            <button className="styled-button" onClick={()=>nav("/transactions")}>
              <i className="fas fa-file-invoice" style={{ marginRight: "8px" }}></i>
              {t('viewStatement')}
            </button>
            <button className="styled-button" onClick={()=>nav("/transfer")}>
              <i className="fas fa-exchange-alt" style={{ marginRight: "8px" }}></i>
              {t('quickTransfer')}
            </button>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="">
            <section className="account-section">
              {/* <h3 className="section-title">Your Accounts</h3> */}
              <DashboardCards />
            </section>

            <section className="quick-links-section">
              {/* <h3 className="section-title">Quick Access</h3> */}
              <QuickLinks />
            </section>

            <section className="insights-section">
              {/* <h3 className="section-title">Personalized Insights</h3> */}
              <InsightsOffers />
            </section>
          </div>

          {/* Right Column */}
          {/* <div className="side-content">
            <section className="updates-section">
              <h3 className="section-title">Latest Updates</h3>
              <SliderComponent />
            </section>

            <section className="activity-section">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon transfer">TZS  </div>
                  <div className="activity-details">
                    <h4>Fund Transfer</h4>
                    <p>To: John Smith</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-amount debit">-TZS  5,000</div>
                </div>
              </div>
            </section>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default DashBoard