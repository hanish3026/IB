import React, { useState } from 'react';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../css/OverAllPaymentsPage.css';

const TransferConfirmation = ({ 
  transferData, 
  paymentType = 'own',
  onConfirm, 
  onCancel, 
  loading = false,
  renderSessionTimer 
}) => {
  const { t } = useTranslation('transfer');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmChange = (e) => {
    setIsConfirmed(e.target.checked);
  };

  const handleConfirmSubmit = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="neft-confirmation">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="neft-title">
          {paymentType === 'own' && t('confirmOwnAccountTransfer')}
          {paymentType === 'within' && t('confirmBankTransfer')}
          {paymentType === 'neft' && t('confirmNeftTransfer')} 
          {paymentType === 'domestic' && t('confirmDomesticTransfer')}
          {paymentType === 'international' && t('confirmInternationalTransfer')}
          {paymentType === 'beneficiary' && t('confirmBeneficiaryRegistration')}
          {paymentType === 'scheduled' && t('confirmScheduledTransfer')}
        </h2>
        {renderSessionTimer && renderSessionTimer()}
      </div>
      
      <div className="neft-confirmation-details">
        {/* From Account */}
        {paymentType !== 'beneficiary' && <div className="neft-confirmation-row">
          <span className="neft-confirmation-label">{t('fromAccount')}:</span>
          <span className="neft-confirmation-value">
            {transferData.fromAccount}
          </span>
        </div>}
        
        {/* To Account */}
        {paymentType !== 'beneficiary' && <div className="neft-confirmation-row">
          <span className="neft-confirmation-label">
            {paymentType === 'own' ? t('toAccount') + ':' : 
             paymentType === 'international' ? t('beneficiaryAccount') + ':' : t('beneficiaryAccount') + ':'}
          </span>
          <span className="neft-confirmation-value">
            {transferData.toAccount}
          </span>
        </div>}
        
        {/* Beneficiary Name - for non-own transfers */}
        {paymentType !== 'own' && transferData.beneficiaryName && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('beneficiaryName')}:</span>
            <span className="neft-confirmation-value">{transferData.beneficiaryName}</span>
          </div>
        )}
        
        {/* SWIFT Code - for international transfers */}
        {paymentType === 'international' && transferData.swiftCode && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('swiftCode')}:</span>
            <span className="neft-confirmation-value">{transferData.swiftCode}</span>
          </div>
        )}
        
        {/* IBAN Number - for international transfers */}
        {paymentType === 'international' && transferData.ibanNumber && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('ibanNumber')}:</span>
            <span className="neft-confirmation-value">{transferData.ibanNumber}</span>
          </div>
        )}
        
        {/* Bank Code - for domestic and international transfers */}
        {(paymentType === 'domestic' || paymentType === 'international') && transferData.bankCode && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('bankCode')}:</span>
            <span className="neft-confirmation-value">{transferData.bankCode}</span>
          </div>
        )}
        
        {/* Bank Name - for domestic and international transfers */}
        {(paymentType === 'domestic' || paymentType === 'international') && transferData.bankName && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('bankName')}:</span>
            <span className="neft-confirmation-value">{transferData.bankName}</span>
          </div>
        )}
        
        {/* Branch Name - for domestic and international transfers */}
        {(paymentType === 'domestic' || paymentType === 'international') && transferData.branchName && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('branchName')}:</span>
            <span className="neft-confirmation-value">{transferData.branchName}</span>
          </div>
        )}
        
        {/* FSC Code - for NEFT/within bank transfers */}
        {(paymentType === 'neft' || paymentType === 'within') && transferData.FSCCode && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('bankAndFscCode')}:</span>
            <span className="neft-confirmation-value">{transferData.FSCCode}</span>
          </div>
        )}
        
        {/* Credit Amount - for own account and domestic transfers */}
        {(paymentType === 'own' || paymentType === 'domestic') && transferData.creditAmount && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('creditAmount')}:</span>
            <span className="neft-confirmation-value neft-amount">
              TZS {formatAmount(transferData.creditAmount)}
            </span>
          </div>
        )}
        
        {/* Credit Amount for International - in USD */}
        {paymentType === 'international' && transferData.creditAmount && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('creditAmount')}:</span>
            <span className="neft-confirmation-value neft-amount">
              USD {formatAmount(transferData.creditAmount)}
            </span>
          </div>
        )}
        
        {/* Debit Amount - for own account, domestic and international transfers */}
        {(paymentType === 'own' || paymentType === 'domestic' || paymentType === 'international') && transferData.debitAmount && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('debitAmount')}:</span>
            <span className="neft-confirmation-value neft-amount">
              TZS {formatAmount(transferData.debitAmount)}
            </span>
          </div>
        )}
        
        {/* Amount - for other transfer types */}
        {(paymentType !== 'own' && paymentType !== 'domestic' && paymentType !== 'international') && transferData.amount && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('amount')}:</span>
            <span className="neft-confirmation-value neft-amount">
              TZS {formatAmount(transferData.amount)}
            </span>
          </div>
        )}
        
        {/* Purpose Code - for own account, domestic and international transfers */}
        {(paymentType === 'own' || paymentType === 'domestic' || paymentType === 'international') && transferData.purposeCode && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('purposeCode')}:</span>
            <span className="neft-confirmation-value">{transferData.purposeCode}</span>
          </div>
        )}
        
        {/* Charges By - for international transfers */}
        {paymentType === 'international' && transferData.chargesBy && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('chargesBy')}:</span>
            <span className="neft-confirmation-value">
              {transferData.chargesBy === 'OUR' && t('chargesByOur')}
              {transferData.chargesBy === 'BEN' && t('chargesByBen')}
              {transferData.chargesBy === 'SHA' && t('chargesBySha')}
            </span>
          </div>
        )}
        
        {/* Description/Remarks */}
        {transferData.description && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">
              {paymentType === 'within' ? t('remarks') + ':' : t('description') + ':'}
            </span>
            <span className="neft-confirmation-value">{transferData.description}</span>
          </div>
        )}
        
        {/* Transfer Type */}
        {transferData.transferType && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('transferType')}:</span>
            <span className="neft-confirmation-value">
              {transferData.transferType === 'immediate' ? t('immediateTransfer') : t('scheduledTransfer')}
            </span>
          </div>
        )}
        
        {/* Payment Method - for non-own transfers */}
        {paymentType !== 'own' && transferData.paymentMethod && (
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('paymentMethod')}:</span>
            <span className="neft-confirmation-value">{transferData.paymentMethod}</span>
          </div>
        )}
        
        {/* Beneficiary Registration Details */}
        {paymentType === 'beneficiary' && (
          <>
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('registrationType')}:</span>
              <span className="neft-confirmation-value">
                {transferData.beneficiaryType === 'domestic' ? t('domesticBeneficiaryRegistration') : t('swiftBeneficiaryRegistration')}
              </span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('beneficiaryName')}:</span>
              <span className="neft-confirmation-value">{transferData.beneficiaryName}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('nickName')}:</span>
              <span className="neft-confirmation-value">{transferData.nickName}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('transferType')}:</span>
              <span className="neft-confirmation-value">{transferData.transferType}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('bankName')}:</span>
              <span className="neft-confirmation-value">{transferData.bankName}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('country')}:</span>
              <span className="neft-confirmation-value">{transferData.countryCode}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('currency')}:</span>
              <span className="neft-confirmation-value">{transferData.currencyCode}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('accountNumber')}:</span>
              <span className="neft-confirmation-value">{transferData.accountNo}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('bankIdentificationCode')}:</span>
              <span className="neft-confirmation-value">{transferData.bankIdentificationCode}</span>
            </div>
            
            {transferData.swiftCode && (
              <div className="neft-confirmation-row">
                <span className="neft-confirmation-label">{t('swiftCode')}:</span>
                <span className="neft-confirmation-value">{transferData.swiftCode}</span>
              </div>
            )}
            
            {transferData.ibanNumber && (
              <div className="neft-confirmation-row">
                <span className="neft-confirmation-label">{t('ibanNumber')}:</span>
                <span className="neft-confirmation-value">{transferData.ibanNumber}</span>
              </div>
            )}
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('branchName')}:</span>
              <span className="neft-confirmation-value">{transferData.branchName}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('emailId')}:</span>
              <span className="neft-confirmation-value">{transferData.emailId}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('mobileNumber')}:</span>
              <span className="neft-confirmation-value">{transferData.mobileNo}</span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('referenceCode')}:</span>
              <span className="neft-confirmation-value">{transferData.referenceCode}</span>
            </div>
          </>
        )}

        {/* Scheduled Transfer Specific Fields */}
        {paymentType === 'scheduled' && (
          <>
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('transferType')}:</span>
              <span className="neft-confirmation-value">
                {transferData.transferType === 'own' && t('ownAccountTransfer')}
                {transferData.transferType === 'domestic' && t('domesticTransfer')}
                {transferData.transferType === 'international' && t('internationalTransfer')}
              </span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('scheduleFrequency')}:</span>
              <span className="neft-confirmation-value">
                {transferData.scheduleFrequency === 'daily' && t('daily')}
                {transferData.scheduleFrequency === 'weekly' && t('weekly')}
                {transferData.scheduleFrequency === 'monthly' && t('monthly')}
              </span>
            </div>
            
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('startDate')}:</span>
              <span className="neft-confirmation-value">{transferData.startDate}</span>
            </div>
            
            {(transferData.scheduleFrequency === 'daily' || transferData.scheduleFrequency === 'weekly') && transferData.endDate && (
              <div className="neft-confirmation-row">
                <span className="neft-confirmation-label">{t('endDate')}:</span>
                <span className="neft-confirmation-value">{transferData.endDate}</span>
              </div>
            )}
            
            {transferData.scheduleFrequency === 'weekly' && transferData.weekday && (
              <div className="neft-confirmation-row">
                <span className="neft-confirmation-label">{t('weekday')}:</span>
                <span className="neft-confirmation-value">
                  {transferData.weekday.charAt(0).toUpperCase() + transferData.weekday.slice(1)}
                </span>
              </div>
            )}
            
            {transferData.scheduleFrequency === 'monthly' && transferData.dayOfMonth && (
              <div className="neft-confirmation-row">
                <span className="neft-confirmation-label">{t('dayOfMonth')}:</span>
                <span className="neft-confirmation-value">
                  {transferData.dayOfMonth === 'last' ? t('lastDayOfMonth') : `${t('day')} ${transferData.dayOfMonth}`}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Transfer timing info */}
      {paymentType === 'neft' && (
        <div className="neft-timing-info">
          <strong>{t('note')}:</strong> {t('neftTransferNote')}
        </div>
      )}
      {paymentType === 'domestic' && (
        <div className="neft-timing-info">
          <strong>{t('note')}:</strong> {t('domesticTransferNote')}
        </div>
      )}
      {paymentType === 'international' && (
        <div className="neft-timing-info">
          <strong>{t('note')}:</strong> {t('internationalTransferNote')}
        </div>
      )}
      {paymentType === 'own' && (
        <div className="neft-timing-info">
          <strong>{t('note')}:</strong> {t('ownAccountTransferNote')}
        </div>
      )}
      {paymentType === 'beneficiary' && (
        <div className="neft-timing-info">
          <strong>{t('note')}:</strong> {t('beneficiaryRegistrationNote')}
        </div>
      )}
      {paymentType === 'scheduled' && (
        <div className="neft-timing-info">
          <strong>{t('note')}:</strong> {t('scheduledTransferNote')}
        </div>
      )}
      
      {/* Confirmation Checkbox */}
      <div className="confirmation-checkbox-container">
        <label className="confirmation-checkbox-label">
          <input
            type="checkbox"
            className="confirmation-checkbox"
            checked={isConfirmed}
            onChange={handleConfirmChange}
          />
          <span className="confirmation-checkbox-text">
            {t('confirmDetailsCorrect')}
          </span>
        </label>
      </div>
      
      <div className="neft-confirmation-actions">
        <button 
          className="own-btn own-btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {t('cancel')}
        </button>
        <button 
          className="own-btn own-btn-primary"
          onClick={handleConfirmSubmit}
          disabled={!isConfirmed || loading}
        >
          {loading ? (
            <span className="neft-processing">
              <span className="neft-spinner"></span>
              {t('processing')}
            </span>
          ) : t('proceedToAuthentication')}
        </button>
      </div>
    </div>
  );
};

export default TransferConfirmation; 