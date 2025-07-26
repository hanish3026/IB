import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/BeneficiaryManagement.css';
import TransferConfirmation from './TransferConfirmation';
import TransferAuthentication from './TransferAuthentication';
import { ScaleLoader } from "react-spinners";
import { FaCheck, FaGlobe, FaBuilding, FaCheckCircle, FaClock } from 'react-icons/fa';
import useScrollToTop from '../../../hooks/useScrollToTop';
import { sendBeneficiaryRequest } from '../../../PaymentApi/BeneficiaryRequest';

const BeneficiaryManagement = ({ onComplete, setSelectedModule }) => {
  const { t } = useTranslation('transfer');  
  const scrollToTop = useScrollToTop();
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'confirmation', 'authentication', 'success'
  const [beneficiaryType, setBeneficiaryType] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    beneficiaryName: '',
    nickName: '',
    transferType: '',
    bankName: '',
    countryCode: '',
    currencyCode: '',
    accountNo: '',
    bankIdentificationCode: '',
    branchName: '',
    emailId: '',
    mobileNo: '',
    referenceCode: '',
    // Additional fields for Swift
    swiftCode: '',
    ibanNumber: ''
  });

  const [errors, setErrors] = useState({});

  // Transfer types for dropdown
  const transferTypes = [
    { code: 'NEFT', description: 'NEFT Transfer' },
    { code: 'RTGS', description: 'RTGS Transfer' },
    { code: 'IMPS', description: 'IMPS Transfer' },
    { code: 'UPI', description: 'UPI Transfer' },
    { code: 'WIRE', description: 'Wire Transfer' }
  ];

  // Country codes
  const countryCodes = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'UAE' },
    { code: 'TZ', name: 'Tanzania' }
  ];

  // Currency codes
  const currencyCodes = [
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'INR', name: 'Indian Rupee' }
  ];

  // Bank names for domestic
  const domesticBanks = [
    'CRDB Bank',
    'National Microfinance Bank',
    'National Bank of Commerce',
    'Diamond Trust Bank',
    'Standard Chartered Bank',
    'Exim Bank',
    'Bank of Africa',
    'Equity Bank',
    'Kenya Commercial Bank',
    'Absa Bank'
  ];

  // International banks for swift
  const internationalBanks = [
    'JPMorgan Chase Bank',
    'Bank of America',
    'Citibank',
    'Wells Fargo Bank',
    'HSBC Bank',
    'Barclays Bank',
    'Lloyds Bank',
    'Deutsche Bank',
    'BNP Paribas',
    'UBS Switzerland'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBeneficiaryTypeChange = (e) => {
    setBeneficiaryType(e.target.value);
    // Reset form when type changes
    setFormData({
      beneficiaryName: '',
      nickName: '',
      transferType: '',
      bankName: '',
      countryCode: '',
      currencyCode: '',
      accountNo: '',
      bankIdentificationCode: '',
      branchName: '',
      emailId: '',
      mobileNo: '',
      referenceCode: '',
      swiftCode: '',
      ibanNumber: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.beneficiaryName.trim()) {
      newErrors.beneficiaryName = 'Beneficiary name is required';
    }

    if (!formData.nickName.trim()) {
      newErrors.nickName = 'Nick name is required';
    }

    if (!formData.transferType) {
      newErrors.transferType = 'Transfer type is required';
    }

    if (!formData.bankName) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.countryCode) {
      newErrors.countryCode = 'Country code is required';
    }

    if (!formData.currencyCode) {
      newErrors.currencyCode = 'Currency code is required';
    }

    if (!formData.accountNo.trim()) {
      newErrors.accountNo = 'Account number is required';
    } else if (formData.accountNo.length < 8) {
      newErrors.accountNo = 'Account number must be at least 8 digits';
    }

    if (!formData.bankIdentificationCode.trim()) {
      newErrors.bankIdentificationCode = 'Bank identification code is required';
    }

    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email ID is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Invalid email format';
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^\+?[1-9]\d{8,14}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Invalid mobile number format';
    }

    if (!formData.referenceCode.trim()) {
      newErrors.referenceCode = 'Reference code is required';
    }

    // Swift specific validations
    if (beneficiaryType === 'swift') {
      if (!formData.swiftCode.trim()) {
        newErrors.swiftCode = 'SWIFT code is required';
      } else if (formData.swiftCode.length < 8 || formData.swiftCode.length > 11) {
        newErrors.swiftCode = 'SWIFT code must be 8-11 characters';
      }

      if (!formData.ibanNumber.trim()) {
        newErrors.ibanNumber = 'IBAN number is required';
      } else if (formData.ibanNumber.length < 15 || formData.ibanNumber.length > 34) {
        newErrors.ibanNumber = 'Invalid IBAN number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setCurrentStep('confirmation');
        scrollToTop();
      }, 1000);
    }
  };

  const handleConfirmationAccept = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('authentication');
      scrollToTop();
    }, 1000);
  };

  const handleAuthenticationComplete = (authData) => {
    setVerifyingAuth(true);

    const result = sendBeneficiaryRequest(formData)
    
    setTimeout(() => {
      setVerifyingAuth(false);
      setCurrentStep('form');
      setShowSuccessModal(true);
      scrollToTop();
    }, 2000);
  };

  const handleCancel = () => {
    setCurrentStep('form');
    setBeneficiaryType('');
    setFormData({
      beneficiaryName: '',
      nickName: '',
      transferType: '',
      bankName: '',
      countryCode: '',
      currencyCode: '',
      accountNo: '',
      bankIdentificationCode: '',
      branchName: '',
      emailId: '',
      mobileNo: '',
      referenceCode: '',
      swiftCode: '',
      ibanNumber: ''
    });
    setErrors({});
  };

  const handleBackToServices = () => {
    if (onComplete) {
      onComplete();
    }
    if (setSelectedModule) {
      setSelectedModule('');
    }
  };

  // Prepare transfer data for confirmation
  const getTransferDataForConfirmation = () => {
    return {
      beneficiaryName: formData.beneficiaryName,
      nickName: formData.nickName,
      transferType: formData.transferType,
      bankName: formData.bankName,
      countryCode: formData.countryCode,
      currencyCode: formData.currencyCode,
      accountNo: formData.accountNo,
      bankIdentificationCode: formData.bankIdentificationCode,
      branchName: formData.branchName,
      emailId: formData.emailId,
      mobileNo: formData.mobileNo,
      referenceCode: formData.referenceCode,
      swiftCode: formData.swiftCode,
      ibanNumber: formData.ibanNumber,
      beneficiaryType: beneficiaryType
    };
  };

  // Prepare transfer details for success page
  const getTransferDetails = () => {
    return {
      beneficiaryName: formData.beneficiaryName,
      accountNumber: formData.accountNo,
      bankName: formData.bankName,
      branchName: formData.branchName,
      transferType: formData.transferType,
      countryCode: formData.countryCode,
      currencyCode: formData.currencyCode,
      swiftCode: formData.swiftCode,
      ibanNumber: formData.ibanNumber,
      emailId: formData.emailId,
      mobileNo: formData.mobileNo,
      registrationType: beneficiaryType === 'domestic' ? 'Domestic Beneficiary' : 'Swift Beneficiary'
    };
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    handleCancel(); // Reset form
    if (onComplete) {
      onComplete();
    }
    if (setSelectedModule) {
      setSelectedModule('');
    }
  };

  const renderSuccessModal = () => {
    if (!showSuccessModal) return null;
    
    return (
      <div className="alert-modal-overlay">
        <div className="alert-modal success-modal">
          <div className="success-modal-icon">
            <FaCheckCircle size={50} color="#28a745" />
          </div>
          <h3 className="success-modal-title">{t('beneficiaryAddedSuccessfully')}</h3>
          <div className="success-modal-content">
            <p className="success-message">
              <strong>{formData.beneficiaryName}</strong> {t('hasBeenSuccessfullyRegistered')}
            </p>
            <div className="beneficiary-details">
              <p><strong>{t('nickName')}:</strong> {formData.nickName}</p>
              <p><strong>{t('accountNo')}:</strong> {formData.accountNo}</p>
              <p><strong>{t('bankName')}:</strong> {formData.bankName}</p>
              <p><strong>{t('type')}:</strong> {beneficiaryType === 'domestic' ? t('domestic') : t('international')}</p>
            </div>
            <div className="payment-notice">
              <FaClock size={20} color="#ffc107" />
              <p className="notice-text">
                <strong>{t('important')}</strong> {t('canMakePayments')} <strong>{t('daysFromToday')}</strong>
                {t('waitingPeriodSecurity')}
              </p>
            </div>
          </div>
          <div className="success-modal-actions">
            <button 
              className="own-btn own-btn-primary"
              onClick={handleCloseSuccessModal}
            >
              {t('continue')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <form className="own-form" onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="own-title">{t('beneficiaryManagement')}</h2>
      </div>
      
      <div className="own-form-content">
        {/* Beneficiary Type Selection */}
        <div className="own-form-row">
          <div className="own-form-group">
            <label className="own-form-label" htmlFor="beneficiaryType">
              {t('selectBeneficiaryType')}
            </label>
            <select
              className={`own-form-select ${!beneficiaryType ? 'own-error-input' : ''}`}
              id="beneficiaryType"
              value={beneficiaryType}
              onChange={handleBeneficiaryTypeChange}
              required
            >
              <option value="">{t('selectBeneficiaryTypePlaceholder')}</option>
              <option value="domestic">{t('domesticBeneficiaryRegistration')}</option>
              <option value="swift">{t('swiftBeneficiaryRegistration')}</option>
            </select>
          </div>
        </div>

        {beneficiaryType && (
          <>
            {/* Registration Type Header */}
            <div className="registration-type-header">
              {/* <div className="type-icon">
                {beneficiaryType === 'domestic' ? <FaBuilding /> : <FaGlobe />}
              </div> */}
              <div className="type-info">
                <h3>
                  {beneficiaryType === 'domestic' 
                    ? t('domesticBeneficiaryRegistration')
                    : t('swiftBeneficiaryRegistration')}
                </h3>
                <p className='text-muted'>
                  {beneficiaryType === 'domestic' 
                    ? t('domesticBeneficiaryDescription')
                    : t('swiftBeneficiaryDescription')}
                </p>
              </div>
            </div>

            {/* Beneficiary Name and Nick Name */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="beneficiaryName">
                  {t('beneficiaryName')}
                </label>
                <input
                  type="text"
                  className={`own-form-input ${errors.beneficiaryName ? 'own-error-input' : ''}`}
                  id="beneficiaryName"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  placeholder={t('enterBeneficiaryFullName')}
                  required
                />
                {errors.beneficiaryName && <span className="own-error-message">{errors.beneficiaryName}</span>}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="nickName">
                  {t('nickName')}
                </label>
                <input
                  type="text"
                  className={`own-form-input ${errors.nickName ? 'own-error-input' : ''}`}
                  id="nickName"
                  name="nickName"
                  value={formData.nickName}
                  onChange={handleChange}
                  placeholder={t('enterNickName')}
                  required
                />
                {errors.nickName && <span className="own-error-message">{errors.nickName}</span>}
              </div>
            </div>

            {/* Transfer Type and Bank Name */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="transferType">
                  {t('transferType')}
                </label>
                <select
                  className={`own-form-select ${errors.transferType ? 'own-error-input' : ''}`}
                  id="transferType"
                  name="transferType"
                  value={formData.transferType}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('selectTransferType')}</option>
                  {transferTypes.map((type, index) => (
                    <option key={index} value={type.code}>
                      {type.code} - {type.description}
                    </option>
                  ))}
                </select>
                {errors.transferType && <span className="own-error-message">{errors.transferType}</span>}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="bankName">
                  {t('bankName')}
                </label>
                <select
                  className={`own-form-select ${errors.bankName ? 'own-error-input' : ''}`}
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('selectBank')}</option>
                  {(beneficiaryType === 'domestic' ? domesticBanks : internationalBanks).map((bank, index) => (
                    <option key={index} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                {errors.bankName && <span className="own-error-message">{errors.bankName}</span>}
              </div>
            </div>

            {/* Country Code and Currency Code */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="countryCode">
                  {t('countryCode')}
                </label>
                <select
                  className={`own-form-select ${errors.countryCode ? 'own-error-input' : ''}`}
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('selectCountry')}</option>
                  {countryCodes.map((country, index) => (
                    <option key={index} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
                {errors.countryCode && <span className="own-error-message">{errors.countryCode}</span>}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="currencyCode">
                  {t('currencyCode')}
                </label>
                <select
                  className={`own-form-select ${errors.currencyCode ? 'own-error-input' : ''}`}
                  id="currencyCode"
                  name="currencyCode"
                  value={formData.currencyCode}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('selectCurrency')}</option>
                  {currencyCodes.map((currency, index) => (
                    <option key={index} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                {errors.currencyCode && <span className="own-error-message">{errors.currencyCode}</span>}
              </div>
            </div>

            {/* Account No and Bank Identification Code */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="accountNo">
                  {t('accountNo')}
                </label>
                <input
                  type="text"
                  className={`own-form-input ${errors.accountNo ? 'own-error-input' : ''}`}
                  id="accountNo"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleChange}
                  placeholder={t('enterAccountNumber')}
                  required
                />
                {errors.accountNo && <span className="own-error-message">{errors.accountNo}</span>}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="bankIdentificationCode">
                  {t('bankIdentificationCode')}
                </label>
                <input
                  type="text"
                  className={`own-form-input ${errors.bankIdentificationCode ? 'own-error-input' : ''}`}
                  id="bankIdentificationCode"
                  name="bankIdentificationCode"
                  value={formData.bankIdentificationCode}
                  onChange={handleChange}
                  placeholder={t('enterBankIdentificationCode')}
                  required
                />
                {errors.bankIdentificationCode && <span className="own-error-message">{errors.bankIdentificationCode}</span>}
              </div>
            </div>

            {/* Swift Code and IBAN (for Swift only) */}
            {beneficiaryType === 'swift' && (
              <div className="own-form-row">
                <div className="own-form-group">
                  <label className="own-form-label" htmlFor="swiftCode">
                    {t('swiftCode')}
                  </label>
                  <input
                    type="text"
                    className={`own-form-input ${errors.swiftCode ? 'own-error-input' : ''}`}
                    id="swiftCode"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    placeholder={t('enterSwiftCode')}
                    maxLength={11}
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  {errors.swiftCode && <span className="own-error-message">{errors.swiftCode}</span>}
                </div>

                <div className="own-form-group">
                  <label className="own-form-label" htmlFor="ibanNumber">
                    {t('iban')}
                  </label>
                  <input
                    type="text"
                    className={`own-form-input ${errors.ibanNumber ? 'own-error-input' : ''}`}
                    id="ibanNumber"
                    name="ibanNumber"
                    value={formData.ibanNumber}
                    onChange={handleChange}
                    placeholder={t('enterIbanNumber')}
                    maxLength={34}
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  {errors.ibanNumber && <span className="own-error-message">{errors.ibanNumber}</span>}
                </div>
              </div>
            )}

            {/* Branch Name */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="branchName">
                  {t('branchName')}
                </label>
                <input
                  type="text"
                  className={`own-form-input ${errors.branchName ? 'own-error-input' : ''}`}
                  id="branchName"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder={t('enterBranchName')}
                  required
                />
                {errors.branchName && <span className="own-error-message">{errors.branchName}</span>}
              </div>
            </div>

            {/* Email ID and Mobile No */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="emailId">
                  {t('emailId')}
                </label>
                <input
                  type="email"
                  className={`own-form-input ${errors.emailId ? 'own-error-input' : ''}`}
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder={t('enterEmailAddress')}
                  required
                />
                {errors.emailId && <span className="own-error-message">{errors.emailId}</span>}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="mobileNo">
                  {t('mobileNo')}
                </label>
                <input
                  type="tel"
                  className={`own-form-input ${errors.mobileNo ? 'own-error-input' : ''}`}
                  id="mobileNo"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  placeholder={t('enterMobileNumberWithCountryCode')}
                  required
                />
                {errors.mobileNo && <span className="own-error-message">{errors.mobileNo}</span>}
              </div>
            </div>

            {/* Reference Code */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="referenceCode">
                  {t('referenceCode')}
                </label>
                <input
                  type="text"
                  className={`own-form-input ${errors.referenceCode ? 'own-error-input' : ''}`}
                  id="referenceCode"
                  name="referenceCode"
                  value={formData.referenceCode}
                  onChange={handleChange}
                  placeholder={t('enterReferenceCode')}
                  required
                />
                {errors.referenceCode && <span className="own-error-message">{errors.referenceCode}</span>}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Button Actions */}
      <div className="own-form-actions">
        <button 
          type="button" 
          className="own-btn own-btn-secondary"
          onClick={handleCancel}
        >
          {t('cancel')}
        </button>
        <button 
          type="submit" 
          className="own-btn own-btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              {/* <ScaleLoader color="#ffffff" height={15} width={2} radius={2} margin={2} /> */}
              <span style={{ marginLeft: '10px' }}>{t('processing')}</span>
            </>
          ) : (
            t('registerBeneficiary')
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container">
      {renderSuccessModal()}
      
      {currentStep === 'form' && renderForm()}
      
      {currentStep === 'confirmation' && (
        <TransferConfirmation
          transferData={getTransferDataForConfirmation()}
          paymentType="beneficiary"
          onConfirm={handleConfirmationAccept}
          onCancel={handleCancel}
          loading={isProcessing}
        />
      )}
      
      {currentStep === 'authentication' && (
        <TransferAuthentication
          onAuthenticate={handleAuthenticationComplete}
          onCancel={() => setCurrentStep('confirmation')}
          loading={loading}
          verifyingAuth={verifyingAuth}
        />
      )}
    </div>
  );
};

export default BeneficiaryManagement;
