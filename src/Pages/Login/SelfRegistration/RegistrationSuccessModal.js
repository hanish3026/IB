import React from 'react';
import './RegistrationSuccessModal.css';

const RegistrationSuccessModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="registration-modal-overlay" onClick={handleBackdropClick}>
      <div className="registration-modal-container">
        <div className="registration-modal-header">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#10B981"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Registration Successful!</h2>
        </div>
        
        <div className="registration-modal-body">
          <p className="success-message">
            You have been successfully registered your Internet Banking with <strong>Demo Bank</strong>.
          </p>
          
          <div className="info-section">
            <div className="info-item">
              <span className="info-icon">📧</span>
              <p>You will be receiving the confirmation Mail/Letter to the registered address along with Login Credentials.</p>
            </div>
            
            <div className="info-item">
              <span className="info-icon">🏦</span>
              <p>Kindly reach <strong>Backoffice@demobank.com</strong> if it's not received or for any further support.</p>
            </div>
          </div>
        </div>
        
        <div className="registration-modal-footer">
          <button 
            className="exit-button"
            onClick={onClose}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessModal; 