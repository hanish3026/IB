import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa';

const BillPaySuccess = ({ category, provider, paymentDetails, onStartNew }) => {
  const { t } = useTranslation('billpay');
  const transactionId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="billpay-success">
      <div className="success-icon">
        <FaCheckCircle />
      </div>
      
      <h2 className="success-title">{t('success.paymentSuccessful')}</h2>
      <p className="success-message">
        {t('success.paymentProcessed', { provider: provider.name })}
      </p>
      
      <div className="receipt-card">
        <div className="receipt-header">
          <div className="provider-logo">
            <img src={provider.logo} alt={provider.name} />
          </div>
          <div className="provider-details">
            <h3>{provider.name}</h3>
            <p>{category.name}</p>
          </div>
        </div>
        
        <div className="receipt-details">
          <div className="receipt-row">
            <span className="receipt-label">{t('success.transactionId')}</span>
            <span className="receipt-value">{transactionId}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{t('success.dateTime')}</span>
            <span className="receipt-value">{currentDate}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{t('form.accountNumber')}</span>
            <span className="receipt-value">{paymentDetails.accountNumber}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{t('success.amountPaid')}</span>
            <span className="receipt-value receipt-amount">
              {t('currency')} {parseFloat(paymentDetails.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{t('success.status')}</span>
            <span className="receipt-value receipt-status">
              <FaCheckCircle /> {t('paid')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="success-actions">
        <button 
          className="action-btn secondary-btn"
          onClick={() => {
            // Download receipt functionality would go here
            alert(t('success.receiptDownload'));
          }}
        >
          <FaDownload /> {t('success.downloadReceipt')}
        </button>
        <button 
          className="action-btn primary-btn"
          onClick={onStartNew}
        >
          <FaHome /> {t('success.backToDashboard')}
        </button>
      </div>
    </div>
  );
};

export default BillPaySuccess;