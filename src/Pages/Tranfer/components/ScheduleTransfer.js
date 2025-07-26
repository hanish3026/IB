import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/OverAllPaymentsPage.css';
import TransferConfirmation from './TransferConfirmation';
import TransferAuthentication from './TransferAuthentication';
import { FaShieldAlt, FaExclamationTriangle, FaClock, FaPlus, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import useScrollToTop from '../../../hooks/useScrollToTop';
import { ScaleLoader } from "react-spinners";

const ScheduleTransfer = ({ 
  onTransferComplete, 
  setSelectedModule, 
  transferType: propTransferType = null,
  transferData: propTransferData = null 
}) => {
  const { t } = useTranslation('transfer');
  const scrollToTop = useScrollToTop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Component states for flow
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAuthentication, setShowAuthentication] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(false);

  const [formData, setFormData] = useState({
    transferType: propTransferType || '', // 'own', 'domestic', 'international'
    scheduleFrequency: '', // 'daily', 'weekly', 'monthly'
    
    // Common fields
    fromAccount: '',
    toAccount: '',
    creditAmount: '',
    debitAmount: '',
    purposeCode: '',
    description: '',
    
    // Own Account specific
    // (uses common fields only)
    
    // Domestic specific
    beneficiaryName: '',
    bankCode: '',
    branchName: '',
    
    // International specific
    swiftCode: '',
    ibanNumber: '',
    bankName: '',
    chargesBy: '',
    
    // Schedule specific fields
    startDate: '',
    endDate: '',
    weekday: '', // For weekly
    dayOfMonth: '' // For monthly (1-28 or 'last')
  });

  const [errors, setErrors] = useState({});
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isPreFilled, setIsPreFilled] = useState(false);

  // Mock data
  const userAccounts = [
    { id: '1', number: '1234567890', type: 'Savings', balance: 50000, currency: 'TZS' },
    { id: '2', number: '9876543210', type: 'Current', balance: 100000, currency: 'TZS' },
    { id: '3', number: '5555666677', type: 'Salary', balance: 75000, currency: 'TZS' }
  ];

  const dummyBeneficiaries = [
    { id: 1, name: 'John Mwalimu', accountNumber: '1111222233', bankCode: 'CRDB', bankName: 'CRDB Bank', branchName: 'Dar es Salaam Branch' },
    { id: 2, name: 'Mary Kitwana', accountNumber: '4444555566', bankCode: 'NMB', bankName: 'National Microfinance Bank', branchName: 'Mwanza Branch' }
  ];

  const dummyInternationalBeneficiaries = [
    { id: 1, name: 'John Smith', accountNumber: 'USD123456789', ibanNumber: 'US64SVBKUS6S3300958879', swiftCode: 'CHASUS33', bankCode: 'CHAS', bankName: 'JPMorgan Chase Bank', branchName: 'New York Branch' },
    { id: 2, name: 'Sarah Johnson', accountNumber: 'GBP987654321', ibanNumber: 'GB29NWBK60161331926819', swiftCode: 'HBUKGB4B', bankCode: 'HSBC', bankName: 'HSBC Bank', branchName: 'London Branch' }
  ];

  const purposeCodes = {
    own: [
      { code: 'SAV001', description: t('savingsToCurrentTransfer') },
      { code: 'CUR001', description: t('currentToSavingsTransfer') },
      { code: 'SAL001', description: t('salaryAccountTransfer') }
    ],
    domestic: [
      { code: 'DOM001', description: t('domesticTransfer') },
      { code: 'FAM001', description: t('familySupport') },
      { code: 'BUS001', description: t('businessPayment') }
    ],
    international: [
      { code: 'INT001', description: t('internationalTransfer') },
      { code: 'FAM002', description: t('familySupport') },
      { code: 'BUS002', description: t('businessPayment') }
    ]
  };

  const bankCodes = [
    { code: 'CRDB', name: 'CRDB Bank' },
    { code: 'NMB', name: 'National Microfinance Bank' },
    { code: 'NBC', name: 'National Bank of Commerce' }
  ];

  const internationalBanks = [
    { code: 'CHAS', name: 'JPMorgan Chase Bank', country: 'USA', swift: 'CHASUS33' },
    { code: 'HSBC', name: 'HSBC Bank', country: 'UK', swift: 'HBUKGB4B' },
    { code: 'DEUTSCHE', name: 'Deutsche Bank', country: 'Germany', swift: 'DEUTDEFF' }
  ];

  const chargesOptions = [
    { code: 'OUR', description: 'OUR - All charges borne by sender' },
    { code: 'BEN', description: 'BEN - All charges borne by beneficiary' },
    { code: 'SHA', description: 'SHA - Charges shared between sender and beneficiary' }
  ];

  const weekdays = [
    { value: 'monday', label: t('monday') },
    { value: 'tuesday', label: t('tuesday') },
    { value: 'wednesday', label: t('wednesday') },
    { value: 'thursday', label: t('thursday') },
    { value: 'friday', label: t('friday') },
    { value: 'saturday', label: t('saturday') },
    { value: 'sunday', label: t('sunday') }
  ];

  // Auto-fill from props on component mount
  useEffect(() => {
    scrollToTop();
    if (propTransferData) {
      setFormData(prevState => ({
        ...prevState,
        ...propTransferData,
        transferType: propTransferType || prevState.transferType
      }));
      setIsPreFilled(true);
    }
  }, [propTransferType, propTransferData]);

  // Update available balance when from account changes
  useEffect(() => {
    if (formData.fromAccount) {
      const selectedAccount = userAccounts.find(acc => acc.number === formData.fromAccount);
      if (selectedAccount) {
        setAvailableBalance(selectedAccount.balance);
      }
    } else {
      setAvailableBalance(0);
    }
  }, [formData.fromAccount]);

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

    // Auto-calculate the other amount when one is entered
    if (name === 'creditAmount' && value) {
      setFormData(prevState => ({
        ...prevState,
        debitAmount: value
      }));
    } else if (name === 'debitAmount' && value) {
      setFormData(prevState => ({
        ...prevState,
        creditAmount: value
      }));
    }

    // Handle beneficiary selection
    if (name === 'toAccount' && formData.transferType === 'domestic') {
      const selectedBeneficiary = dummyBeneficiaries.find(ben => ben.id === parseInt(value));
      if (selectedBeneficiary) {
        setFormData(prevState => ({
          ...prevState,
          toAccount: selectedBeneficiary.accountNumber,
          beneficiaryName: selectedBeneficiary.name,
          bankCode: selectedBeneficiary.bankCode,
          branchName: selectedBeneficiary.branchName
        }));
      }
    }

    if (name === 'toAccount' && formData.transferType === 'international') {
      const selectedBeneficiary = dummyInternationalBeneficiaries.find(ben => ben.id === parseInt(value));
      if (selectedBeneficiary) {
        setFormData(prevState => ({
          ...prevState,
          toAccount: selectedBeneficiary.accountNumber,
          beneficiaryName: selectedBeneficiary.name,
          swiftCode: selectedBeneficiary.swiftCode,
          ibanNumber: selectedBeneficiary.ibanNumber,
          bankCode: selectedBeneficiary.bankCode,
          bankName: selectedBeneficiary.bankName,
          branchName: selectedBeneficiary.branchName
        }));
      }
    }

    // Auto-fill bank name when bank code is selected for international
    if (name === 'bankCode' && formData.transferType === 'international') {
      const selectedBank = internationalBanks.find(bank => bank.code === value);
      if (selectedBank) {
        setFormData(prevState => ({
          ...prevState,
          bankName: selectedBank.name,
          swiftCode: selectedBank.swift
        }));
      }
    }

    // Reset transfer-specific fields when transfer type changes
    if (name === 'transferType') {
      setFormData(prevState => ({
        ...prevState,
        toAccount: '',
        beneficiaryName: '',
        bankCode: '',
        branchName: '',
        swiftCode: '',
        ibanNumber: '',
        bankName: '',
        chargesBy: '',
        purposeCode: ''
      }));
    }

    // Reset schedule-specific fields when frequency changes
    if (name === 'scheduleFrequency') {
      setFormData(prevState => ({
        ...prevState,
        startDate: '',
        endDate: '',
        weekday: '',
        dayOfMonth: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.transferType) {
      newErrors.transferType = 'Please select transfer type';
    }

    if (!formData.scheduleFrequency) {
      newErrors.scheduleFrequency = 'Please select schedule frequency';
    }

    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Please select source account';
    }

    if (!formData.toAccount) {
      newErrors.toAccount = 'Please select destination account';
    }

    if (formData.transferType === 'own' && formData.fromAccount === formData.toAccount) {
      newErrors.toAccount = 'Source and destination accounts cannot be the same';
    }

    if (!formData.creditAmount && !formData.debitAmount) {
      newErrors.creditAmount = 'Please enter amount';
    } else {
      const amount = parseFloat(formData.creditAmount || formData.debitAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.creditAmount = 'Please enter a valid amount greater than 0';
      } else if (amount > availableBalance) {
        newErrors.creditAmount = 'Insufficient funds in your account';
      }
    }

    if (!formData.purposeCode) {
      newErrors.purposeCode = 'Please select a purpose code';
    }

    // Domestic specific validations
    if (formData.transferType === 'domestic') {
      if (!formData.beneficiaryName) {
        newErrors.beneficiaryName = 'Please enter beneficiary name';
      }
      if (!formData.bankCode) {
        newErrors.bankCode = 'Please select bank code';
      }
      if (!formData.branchName) {
        newErrors.branchName = 'Please enter branch name';
      }
    }

    // International specific validations
    if (formData.transferType === 'international') {
      if (!formData.beneficiaryName) {
        newErrors.beneficiaryName = 'Please enter beneficiary name';
      }
      if (!formData.swiftCode) {
        newErrors.swiftCode = 'Please enter SWIFT code';
      }
      if (!formData.ibanNumber) {
        newErrors.ibanNumber = 'Please enter IBAN number';
      }
      if (!formData.bankName) {
        newErrors.bankName = 'Please enter bank name';
      }
      if (!formData.branchName) {
        newErrors.branchName = 'Please enter branch name';
      }
      if (!formData.chargesBy) {
        newErrors.chargesBy = 'Please select charges option';
      }
    }

    // Schedule specific validations
    if (!formData.startDate) {
      newErrors.startDate = 'Please select start date';
    }

    if (formData.scheduleFrequency === 'weekly') {
      if (!formData.endDate) {
        newErrors.endDate = 'Please select end date';
      } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.scheduleFrequency === 'weekly' && !formData.weekday) {
      newErrors.weekday = 'Please select weekday';
    }

    if (formData.scheduleFrequency === 'monthly' && !formData.dayOfMonth) {
      newErrors.dayOfMonth = 'Please select day of month';
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
        setShowConfirmation(true);
        scrollToTop();
      }, 1000);
    }
  };

  const handleConfirmationAccept = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      setShowAuthentication(true);
    }, 1000);
  };

  const handleAuthenticationComplete = (authData) => {
    setVerifyingAuth(true);
    setTimeout(() => {
      setVerifyingAuth(false);
      setShowAuthentication(false);
      setShowSuccessModal(true);
      scrollToTop();
    }, 2000);
  };

  const handleAuthenticationCancel = () => {
    setShowAuthentication(false);
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setShowAuthentication(false);
    setSelectedModule('');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedModule('');
  };

  const formatAccountNumber = (account) => {
    return `${account.number.slice(0, 4)}...${account.number.slice(-4)} (${account.type}) - TZS ${account.balance.toLocaleString()}`;
  };

  const getTransferDataForConfirmation = () => {
    const baseData = {
      transferType: formData.transferType,
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount,
      creditAmount: formData.creditAmount,
      debitAmount: formData.debitAmount,
      purposeCode: formData.purposeCode,
      description: formData.description,
      scheduleFrequency: formData.scheduleFrequency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      weekday: formData.weekday,
      dayOfMonth: formData.dayOfMonth
    };

    if (formData.transferType === 'domestic') {
      return {
        ...baseData,
        beneficiaryName: formData.beneficiaryName,
        bankCode: formData.bankCode,
        branchName: formData.branchName
      };
    }

    if (formData.transferType === 'international') {
      return {
        ...baseData,
        beneficiaryName: formData.beneficiaryName,
        swiftCode: formData.swiftCode,
        ibanNumber: formData.ibanNumber,
        bankCode: formData.bankCode,
        bankName: formData.bankName,
        branchName: formData.branchName,
        chargesBy: formData.chargesBy
      };
    }

    return baseData;
  };

  const renderSuccessModal = () => {
    if (!showSuccessModal) return null;

    const getScheduleText = () => {
      switch (formData.scheduleFrequency) {
        case 'daily':
          return t('dailySchedule', { startDate: formData.startDate, endDate: formData.endDate });
        case 'weekly':
          return t('weeklySchedule', { weekday: formData.weekday, startDate: formData.startDate, endDate: formData.endDate });
        case 'monthly':
          return t('monthlySchedule', { dayOfMonth: formData.dayOfMonth, startDate: formData.startDate });
        default:
          return t('scheduledTransfer');
      }
    };

    return (
      <div className="alert-modal-overlay">
        <div className="alert-modal success-modal">
          <div className="success-modal-icon">
            <FaCheckCircle size={50} color="#28a745" />
          </div>
          <h3 className="success-modal-title">{t('transferScheduledSuccessfully')}</h3>
          <div className="success-modal-content">
            <p className="success-message">
              {t('transferScheduledMessage', { transferType: formData.transferType })}
            </p>
            <div className="beneficiary-details">
              <p><strong>{t('amount')}:</strong> TZS {parseFloat(formData.creditAmount || formData.debitAmount).toLocaleString()}</p>
              <p><strong>{t('from')}:</strong> {formData.fromAccount}</p>
              <p><strong>{t('to')}:</strong> {formData.toAccount}</p>
              <p><strong>{t('schedule')}:</strong> {getScheduleText()}</p>
            </div>
            <div className="payment-notice">
              <FaCalendarAlt size={20} color="#ffc107" />
              <p className="notice-text">
                <strong>{t('important')}:</strong> {t('scheduledTransferNotice')}
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

  const renderDayOfMonthOptions = () => {
    const options = [];
    for (let i = 1; i <= 28; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    options.push(
      <option key="last" value="last">
        {t('lastDayOfMonth')}
      </option>
    );
    return options;
  };

  const renderForm = () => (
    <form className="own-form" onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="own-title">{t('scheduleTransfer')}</h2>
      </div>
      
      <div className="own-form-content">
        {/* Transfer Type Selection */}
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
              disabled={isPreFilled}
            >
              <option value="">{t('selectTransferType')}</option>
              <option value="own">{t('ownAccountTransfer')}</option>
              <option value="domestic">{t('domesticTransfer')}</option>
              <option value="international">{t('internationalTransfer')}</option>
            </select>
            {errors.transferType && <span className="own-error-message">{errors.transferType}</span>}
          </div>
        </div>

        {formData.transferType && (
          <>
            {/* From and To Account */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="fromAccount">{t('fromAccount')}</label>
                <select
                  className={`own-form-select ${errors.fromAccount ? 'own-error-input' : ''}`}
                  id="fromAccount"
                  name="fromAccount"
                  value={formData.fromAccount}
                  onChange={handleChange}
                  required
                  disabled={isPreFilled}
                >
                  <option value="">{t('selectSourceAccount')}</option>
                  {userAccounts.map(account => (
                    <option key={account.id} value={account.number}>
                      {formatAccountNumber(account)}
                    </option>
                  ))}
                </select>
                {errors.fromAccount && <span className="own-error-message">{errors.fromAccount}</span>}
                
                {formData.fromAccount && (
                  <div className="own-account-info">
                    <span className="own-account-balance">{t('availableBalance')}: TZS {availableBalance.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="toAccount">
                  {formData.transferType === 'own' ? t('toAccount') : 
                   formData.transferType === 'domestic' ? t('toAccountBeneficiary') : 
                   t('toAccountInternationalBeneficiary')}
                </label>
                <div className="to-account-container">
                  <select
                    className={`own-form-select ${errors.toAccount ? 'own-error-input' : ''}`}
                    id="toAccount"
                    name="toAccount"
                    value={formData.toAccount ? 
                      (formData.transferType === 'own' ? formData.toAccount :
                       formData.transferType === 'domestic' ? dummyBeneficiaries.find(ben => ben.accountNumber === formData.toAccount)?.id || '' :
                       dummyInternationalBeneficiaries.find(ben => ben.accountNumber === formData.toAccount)?.id || '') : ''}
                    onChange={handleChange}
                    required
                    disabled={isPreFilled}
                  >
                    <option value="">
                      {formData.transferType === 'own' ? t('selectDestinationAccount') :
                       formData.transferType === 'domestic' ? t('selectBeneficiary') :
                       t('selectInternationalBeneficiary')}
                    </option>
                    {formData.transferType === 'own' && 
                      userAccounts
                        .filter(account => account.number !== formData.fromAccount)
                        .map(account => (
                          <option key={account.id} value={account.number}>
                            {formatAccountNumber(account)}
                          </option>
                        ))
                    }
                    {formData.transferType === 'domestic' && 
                      dummyBeneficiaries.map(beneficiary => (
                        <option key={beneficiary.id} value={beneficiary.id}>
                          {beneficiary.name} - {beneficiary.accountNumber.slice(0, 4)}...{beneficiary.accountNumber.slice(-4)} ({beneficiary.bankCode})
                        </option>
                      ))
                    }
                    {formData.transferType === 'international' && 
                      dummyInternationalBeneficiaries.map(beneficiary => (
                        <option key={beneficiary.id} value={beneficiary.id}>
                          {beneficiary.name} - {beneficiary.accountNumber} ({beneficiary.bankName})
                        </option>
                      ))
                    }
                  </select>
                  
                  {formData.transferType !== 'own' && !isPreFilled && (
                    <button
                      type="button"
                      className="m-2 action-button"
                      onClick={() => setSelectedModule('beneficiary')}
                    >
                      <FaPlus /> {t('addBeneficiary')}
                    </button>
                  )}
                </div>
                {errors.toAccount && <span className="own-error-message">{errors.toAccount}</span>}
              </div>
            </div>

            {/* Amount Fields */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="creditAmount">
                  {formData.transferType === 'international' ? t('creditAmountUsd') : t('creditAmount')}
                </label>
                <div className="own-amount-input-wrapper">
                  <span className="own-currency-symbol">
                    {formData.transferType === 'international' ? 'USD ' : 'TZS '}
                  </span>
                  <input
                    type="number"
                    className={`own-form-input ${errors.creditAmount ? 'own-error-input' : ''}`}
                    id="creditAmount"
                    name="creditAmount"
                    value={formData.creditAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    disabled={isPreFilled}
                  />
                </div>
                {errors.creditAmount && <span className="own-error-message">{errors.creditAmount}</span>}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="debitAmount">{t('debitAmount')}</label>
                <div className="own-amount-input-wrapper">
                  <span className="own-currency-symbol">TZS </span>
                  <input
                    type="number"
                    className={`own-form-input ${errors.debitAmount ? 'own-error-input' : ''}`}
                    id="debitAmount"
                    name="debitAmount"
                    value={formData.debitAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    disabled={isPreFilled}
                  />
                </div>
                {errors.debitAmount && <span className="own-error-message">{errors.debitAmount}</span>}
              </div>
            </div>

            {/* Transfer-specific fields */}
            {(formData.transferType === 'domestic' || formData.transferType === 'international') && (
              <>
                <div className="own-form-row">
                  <div className="own-form-group">
                    <label className="own-form-label" htmlFor="beneficiaryName">{t('beneficiaryName')}</label>
                    <input
                      type="text"
                      className={`own-form-input ${errors.beneficiaryName ? 'own-error-input' : ''}`}
                      id="beneficiaryName"
                      name="beneficiaryName"
                      value={formData.beneficiaryName}
                      onChange={handleChange}
                      placeholder={t('enterBeneficiaryName')}
                      required
                      disabled={isPreFilled}
                    />
                    {errors.beneficiaryName && <span className="own-error-message">{errors.beneficiaryName}</span>}
                  </div>

                  {formData.transferType === 'domestic' && (
                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="bankCode">{t('bankCode')}</label>
                      <select
                        className={`own-form-select ${errors.bankCode ? 'own-error-input' : ''}`}
                        id="bankCode"
                        name="bankCode"
                        value={formData.bankCode}
                        onChange={handleChange}
                        required
                        disabled={isPreFilled}
                      >
                        <option value="">{t('selectBankCode')}</option>
                        {bankCodes.map((bank, index) => (
                          <option key={index} value={bank.code}>
                            {bank.code} - {bank.name}
                          </option>
                        ))}
                      </select>
                      {errors.bankCode && <span className="own-error-message">{errors.bankCode}</span>}
                    </div>
                  )}

                  {formData.transferType === 'international' && (
                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="swiftCode">{t('swiftCode')}</label>
                      <input
                        type="text"
                        className={`own-form-input ${errors.swiftCode ? 'own-error-input' : ''}`}
                        id="swiftCode"
                        name="swiftCode"
                        value={formData.swiftCode}
                        onChange={handleChange}
                        placeholder={t('enterSwiftCodePlaceholder')}
                        maxLength={11}
                        required
                        style={{ textTransform: 'uppercase' }}
                        disabled={isPreFilled}
                      />
                      {errors.swiftCode && <span className="own-error-message">{errors.swiftCode}</span>}
                    </div>
                  )}
                </div>

                {formData.transferType === 'international' && (
                  <div className="own-form-row">
                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="ibanNumber">{t('ibanNumber')}</label>
                      <input
                        type="text"
                        className={`own-form-input ${errors.ibanNumber ? 'own-error-input' : ''}`}
                        id="ibanNumber"
                        name="ibanNumber"
                        value={formData.ibanNumber}
                        onChange={handleChange}
                        placeholder={t('enterIbanNumberPlaceholder')}
                        maxLength={34}
                        required
                        style={{ textTransform: 'uppercase' }}
                        disabled={isPreFilled}
                      />
                      {errors.ibanNumber && <span className="own-error-message">{errors.ibanNumber}</span>}
                    </div>

                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="bankName">{t('bankName')}</label>
                      <input
                        type="text"
                        className={`own-form-input ${errors.bankName ? 'own-error-input' : ''}`}
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder={t('enterBankName')}
                        required
                        disabled={isPreFilled}
                      />
                      {errors.bankName && <span className="own-error-message">{errors.bankName}</span>}
                    </div>
                  </div>
                )}

                <div className="own-form-row">
                  <div className="own-form-group">
                    <label className="own-form-label" htmlFor="branchName">{t('branchName')}</label>
                    <input
                      type="text"
                      className={`own-form-input ${errors.branchName ? 'own-error-input' : ''}`}
                      id="branchName"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleChange}
                      placeholder={t('enterBranchName')}
                      required
                      disabled={isPreFilled}
                    />
                    {errors.branchName && <span className="own-error-message">{errors.branchName}</span>}
                  </div>

                  {formData.transferType === 'international' && (
                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="chargesBy">{t('chargesBy')}</label>
                      <select
                        className={`own-form-select ${errors.chargesBy ? 'own-error-input' : ''}`}
                        id="chargesBy"
                        name="chargesBy"
                        value={formData.chargesBy}
                        onChange={handleChange}
                        required
                        disabled={isPreFilled}
                      >
                        <option value="">{t('selectChargesOption')}</option>
                        {chargesOptions.map((charge, index) => (
                          <option key={index} value={charge.code}>
                            {charge.description}
                          </option>
                        ))}
                      </select>
                      {errors.chargesBy && <span className="own-error-message">{errors.chargesBy}</span>}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Purpose Code */}
            <div className="own-form-row">
              <div className="own-form-group">
                <label className="own-form-label" htmlFor="purposeCode">{t('purposeCode')}</label>
                <select
                  className={`own-form-select ${errors.purposeCode ? 'own-error-input' : ''}`}
                  id="purposeCode"
                  name="purposeCode"
                  value={formData.purposeCode}
                  onChange={handleChange}
                  required
                  disabled={isPreFilled}
                >
                  <option value="">{t('selectPurposeCode')}</option>
                  {purposeCodes[formData.transferType]?.map((purpose, index) => (
                    <option key={index} value={purpose.code}>
                      {purpose.code} - {purpose.description}
                    </option>
                  ))}
                </select>
                {errors.purposeCode && <span className="own-error-message">{errors.purposeCode}</span>}
              </div>

              <div className="own-form-group">
                <label className="own-form-label" htmlFor="description">{t('description')} ({t('optional')})</label>
                <input
                  type="text"
                  className={`own-form-input ${errors.description ? 'own-error-input' : ''}`}
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t('enterDescription')}
                  maxLength={50}
                  disabled={isPreFilled}
                />
                <span className="own-form-helper">
                  {formData.description.length}/50 {t('characters')}
                </span>
                {errors.description && <span className="own-error-message">{errors.description}</span>}
              </div>
            </div>

<div className='mb-5'>
<div className="own-form-row">
            <label className="own-form-label" htmlFor="scheduleFrequency">
              {t('scheduleFrequency')}
            </label>
            <select
              className={`own-form-select ${errors.scheduleFrequency ? 'own-error-input' : ''}`}
              id="scheduleFrequency"
              name="scheduleFrequency"
              value={formData.scheduleFrequency}
              onChange={handleChange}
              required
            >
              <option value="">{t('selectFrequency')}</option>
              <option value="daily">{t('daily')}</option>
              <option value="weekly">{t('weekly')}</option>
              <option value="monthly">{t('monthly')}</option>
            </select>
            {errors.scheduleFrequency && <span className="own-error-message">{errors.scheduleFrequency}</span>}
          </div>
</div>
            {/* Schedule Fields */}
            {formData.scheduleFrequency && (
              <>
                <div className="own-form-row">
                  <div className="own-form-group">
                    <label className="own-form-label" htmlFor="startDate">{t('startDate')}</label>
                    <input
                      type="date"
                      className={`own-form-input ${errors.startDate ? 'own-error-input' : ''}`}
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {errors.startDate && <span className="own-error-message">{errors.startDate}</span>}
                  </div>

                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="endDate">{t('endDate')}</label>
                      <input
                        type="date"
                        className={`own-form-input ${errors.endDate ? 'own-error-input' : ''}`}
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                      {errors.endDate && <span className="own-error-message">{errors.endDate}</span>}
                    </div>


                  {formData.scheduleFrequency === 'weekly' && (
                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="weekday">{t('weekday')}</label>
                      <select
                        className={`own-form-select ${errors.weekday ? 'own-error-input' : ''}`}
                        id="weekday"
                        name="weekday"
                        value={formData.weekday}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{t('selectWeekday')}</option>
                        {weekdays.map(day => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                      {errors.weekday && <span className="own-error-message">{errors.weekday}</span>}
                    </div>
                  )}

                  {formData.scheduleFrequency === 'monthly' && (
                    <div className="own-form-group">
                      <label className="own-form-label" htmlFor="dayOfMonth">{t('dayOfMonth')}</label>
                      <select
                        className={`own-form-select ${errors.dayOfMonth ? 'own-error-input' : ''}`}
                        id="dayOfMonth"
                        name="dayOfMonth"
                        value={formData.dayOfMonth}
                        onChange={handleChange}
                        required
                      >
                        <option value="">{t('selectDay')}</option>
                        {renderDayOfMonthOptions()}
                      </select>
                      {errors.dayOfMonth && <span className="own-error-message">{errors.dayOfMonth}</span>}
                    </div>
                  )}
                </div>
              </>
            )}
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
              <span style={{ marginLeft: '10px' }}>{t('processing')}...</span>
            </>
          ) : (
            t('scheduleTransfer')
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container">
      {renderSuccessModal()}
      
      {showConfirmation ? (
        <TransferConfirmation
          transferData={getTransferDataForConfirmation()}
          paymentType="scheduled"
          onConfirm={handleConfirmationAccept}
          onCancel={handleCancel}
          loading={isProcessing}
        />
      ) : showAuthentication ? (
        <TransferAuthentication
          onAuthenticate={handleAuthenticationComplete}
          onCancel={handleAuthenticationCancel}
          loading={loading}
          verifyingAuth={verifyingAuth}
        />
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default ScheduleTransfer;