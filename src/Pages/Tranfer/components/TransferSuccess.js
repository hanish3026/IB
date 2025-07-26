import React from 'react';
import { FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../css/TransferResult.css';

const TransferSuccess = ({ paymentType, transferDetails, onStartNew }) => {
  const { t } = useTranslation('transfer');
  const transactionId = 12345678;
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
        return t('ownAccountTransfer');
      case 'within':
        return t('moneyTransfer');
      case 'neft':
        return t('neftTransfer');
      case 'domestic':
        return t('domesticTransfer');
      case 'international':
        return t('internationalTransfer');
      default:
        return t('transfer');
    }
  };

  return (
    <div className="transfer-success">
      <div className="success-icon">
        <FaCheckCircle />
      </div>
      
      <h2 className="success-title">{t('transferSuccessful')}</h2>
      <p className="success-message">
        {t('yourTransfer')} {getTransferTypeTitle()} {t('transferProcessedSuccessfully')}.
      </p>
      
      <div className="receipt-card">
        <div className="receipt-header">
          <div className="transfer-type-icon">
            {paymentType === 'own' && <i className="fa-solid fa-right-left"></i>}
            {paymentType === 'within' && <i className="fa-solid fa-building-columns"></i>}
            {paymentType === 'neft' && <i className="fa-solid fa-money-bill-transfer"></i>}
            {paymentType === 'domestic' && <i className="fa-solid fa-building-columns"></i>}
          </div>
          <div className="transfer-details">
            <h3>{getTransferTypeTitle()}</h3>
            <p>{paymentType === 'neft' ? t('nationalElectronicFundsTransfer') : t('fundsTransfer')}</p>
          </div>
        </div>
        
        <div className="receipt-details">
          <div className="receipt-row">
            <span className="receipt-label">{t('transactionId')}</span>
            <span className="receipt-value">{transactionId}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{t('dateTime')}</span>
            <span className="receipt-value">{currentDate}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{t('fromAccount')}</span>
            <span className="receipt-value">{transferDetails.fromAccount}</span>
          </div>
          
          <div className="receipt-row">
            <span className="receipt-label">{paymentType === 'own' ? t('toAccount') : t('beneficiaryAccount')}</span>
            <span className="receipt-value">
              {paymentType === 'own' ? transferDetails.toAccount : transferDetails.toAccount}
            </span>
          </div>
          
          {(paymentType === 'within' || paymentType === 'neft') && (
            <div className="receipt-row">
              <span className="receipt-label">{t('beneficiaryName')}</span>
              <span className="receipt-value">{transferDetails.beneficiaryName}</span>
            </div>
          )}
          
          {paymentType === 'neft' && (
            <>
              <div className="receipt-row">
                <span className="receipt-label">{t('bankName')}</span>
                <span className="receipt-value">{transferDetails.bankName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">FSC Code</span>
                <span className="receipt-value">{transferDetails.FSCCode}</span>
              </div>
            </>
          )}
          
          <div className="receipt-row">
            <span className="receipt-label">{t('amount')}</span>
            <span className="receipt-value receipt-amount">
              TZS {parseFloat(transferDetails.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          
          {transferDetails.description && (
            <div className="receipt-row">
              <span className="receipt-label">
                {paymentType === 'within' ? t('remarks') : t('description')}
              </span>
              <span className="receipt-value">
                {transferDetails.description}
              </span>
            </div>
          )}
          
          <div className="receipt-row">
            <span className="receipt-label">{t('status')}</span>
            <span className="receipt-value receipt-status success-receipt-icon">
              <FaCheckCircle className='success-receipt-icon' /> {t('completed')}
            </span>
          </div>
        </div>
      </div>
      
      {paymentType === 'neft' && (
        <div className="transfer-note">
          <strong>{t('note')}:</strong> {t('neftProcessingNote')}
        </div>
      )}
      
      <div className="success-actions">
        <button 
          className="action-btn secondary-btns"
          onClick={() => {
            // Download receipt functionality would go here
            alert('Receipt download functionality would be implemented here');
          }}
        >
          <FaDownload /> {t('print')}
        </button>
        <button 
          className="action-btn primary-btn"
          onClick={onStartNew}
        >
          <FaHome /> {t('backToTransferServices')}
        </button>
      </div>
    </div>
  );
};

export default TransferSuccess;
