import React from 'react';
import { FaTimesCircle, FaRedo, FaHome } from 'react-icons/fa';
import '../css/TransferResult.css';

const TransferFailure = ({ paymentType, transferDetails, onRetry, onStartNew }) => {
  const errorId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get transfer type title
  const getTransferTypeTitle = () => {
    switch (paymentType) {
      case 'own':
        return 'Own Account Transfer';
      case 'within':
        return 'Within Bank Transfer';
      case 'neft':
        return 'NEFT Transfer';
      default:
        return 'Transfer';
    }
  };

  return (
    <div className="transfer-failure">
      <div className="failure-icon">
        <FaTimesCircle />
      </div>
      
      <h2 className="failure-title">Transfer Failed</h2>
      <p className="failure-message">
        We couldn't process your {getTransferTypeTitle()}. Please check the details and try again.
      </p>
      
      <div className="receipt-card">
        <div className="receipt-header failure">
          <div className="transfer-type-icon">
            {paymentType === 'own' && <i className="fa-solid fa-right-left"></i>}
            {paymentType === 'within' && <i className="fa-solid fa-building-columns"></i>}
            {paymentType === 'neft' && <i className="fa-solid fa-money-bill-transfer"></i>}
          </div>
          <div className="transfer-details">
            <h3>{getTransferTypeTitle()}</h3>
            <p>{paymentType === 'neft' ? 'National Electronic Funds Transfer' : 'Funds Transfer'}</p>
          </div>
        </div>
        
        <div className="receipt-details">
          <div className="receipt-row">
            <span className="receipt-label">Error Reference</span>
            <span className="receipt-value">{errorId}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">Date & Time</span>
            <span className="receipt-value">{currentDate}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">From Account</span>
            <span className="receipt-value">{transferDetails.fromAccount}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{paymentType === 'own' ? 'To Account' : 'Beneficiary Account'}</span>
            <span className="receipt-value">
              {paymentType === 'own' ? transferDetails.toAccount : transferDetails.beneficiaryAccount}
            </span>
          </div>
          
          {(paymentType === 'within' || paymentType === 'neft') && (
            <div className="receipt-row">
              <span className="receipt-label">Beneficiary Name</span>
              <span className="receipt-value">{transferDetails.beneficiaryName}</span>
            </div>
          )}
          
          <div className="receipt-row">
            <span className="receipt-label">Amount</span>
            <span className="receipt-value receipt-amount">
              TZS {parseFloat(transferDetails.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">Status</span>
            <span className="receipt-value receipt-status failure">
              <FaTimesCircle /> Failed
            </span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">Error Message</span>
            <span className="receipt-value error-message">
              {transferDetails.errorMessage || "Transaction could not be completed. Please try again later."}
            </span>
          </div>
        </div>
      </div>
      
      <div className="failure-actions">
        <button 
          className="action-btn secondary-btn"
          onClick={onRetry}
        >
          <FaRedo /> Try Again
        </button>
        <button 
          className="action-btn primary-btn"
          onClick={onStartNew}
        >
          <FaHome /> Back to Transfer Services
        </button>
      </div>
    </div>
  );
};

export default TransferFailure;
