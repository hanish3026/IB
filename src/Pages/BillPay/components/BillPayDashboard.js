import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTv, FaMobile, FaBolt, FaWifi, FaTint, FaGasPump } from 'react-icons/fa';
import { getBillCategories, getRecentPayments } from '../data/billPayData';

const BillPayDashboard = ({ onSelectCategory }) => {
  const { t } = useTranslation('billpay');
  const billCategories = getBillCategories();
  const recentPayments = getRecentPayments();
  
  return (
    <div className="billpay-dashboard">
      <div className="dashboard-section">
        <h2 className="section-title">{t('paymentCategories')}</h2>
        <div className="category-grid">
          {billCategories.map((category) => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => onSelectCategory(category)}
            >
              <div className="category-icon" style={{ backgroundColor: category.color }}>
                {getCategoryIcon(category.id)}
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">{t('recentPayments')}</h2>
          <button className="view-all-btn">{t('viewAll')}</button>
        </div>
        <div className="recent-payments">
          {recentPayments.length > 0 ? (
            <div className="payment-list">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="payment-item">
                  <div className="payment-icon">
                    {getCategoryIcon(payment.categoryId)}
                  </div>
                  <div className="payment-details">
                    <h4>{payment.provider}</h4>
                    <p>{payment.accountNumber}</p>
                    <span className="payment-date">{formatDate(payment.date)}</span>
                  </div>
                  <div className="payment-amount">
                    <span className={`amount ${payment.status}`}>
                      {t('currency')} {payment.amount.toLocaleString()}
                    </span>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.statusText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-payments">
              <p>{t('noRecentPayments')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get the appropriate icon for each category
const getCategoryIcon = (categoryId) => {
  switch (categoryId) {
    case 'tv':
      return <FaTv />;
    case 'mobile':
      return <FaMobile />;
    case 'electricity':
      return <FaBolt />;
    case 'internet':
      return <FaWifi />;
    case 'water':
      return <FaTint />;
    case 'gas':
      return <FaGasPump />;
    default:
      return <FaBolt />;
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default BillPayDashboard;