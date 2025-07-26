import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/OverAllPaymentsPage.css';
import TransferSuccess from './TransferSuccess';
import TransferFailure from './TransferFailure';
import TransferConfirmation from './TransferConfirmation';
import TransferAuthentication from './TransferAuthentication';
import { FaShieldAlt, FaExclamationTriangle, FaClock, FaPlus } from 'react-icons/fa';
import useScrollToTop from '../../../hooks/useScrollToTop';
import { sendPaymentRequest } from '../../../PaymentApi/sendPaymentRequest';
import { sendLookupRequest } from '../../../PaymentApi/sendLookupRequest';
import { sendOtpRequest } from '../../../PaymentApi/sendOtpRequest';
import { ScaleLoader } from "react-spinners";
import BeneficiarieApis from '../Apis/BeneficiarieApi';

const DomesticTransfer = ({ onTransferComplete, setSelectedModule }) => {
  const { t } = useTranslation('transfer');
  const scrollToTop = useScrollToTop();
  const navigate = useNavigate();
  const [fromAccountDisabled, setFromAccountDisabled] = useState(false);
  const [toAccountDisabled, setToAccountDisabled] = useState(true);
  const [otherFieldsDisabled, setOtherFieldsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  
  // Payment Token and Timer States
  const [paymentToken, setPaymentToken] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [tokenExpired, setTokenExpired] = useState(false);
  
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    beneficiaryName: '',
    bankCode: '',
    branchName: '',
    creditAmount: '',
    debitAmount: '',
    purposeCode: '',
    description: '',
    transferType: 'immediate'
  });
  
  const [errors, setErrors] = useState({});
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferResult, setTransferResult] = useState(null); // 'success', 'failure', or null
  
  // Component states for new flow
  const [showAuthentication, setShowAuthentication] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(false);

  // Purpose codes for domestic transfer
  const purposeCodes = [
    { code: 'DOM001', description: 'Domestic Transfer' },
    { code: 'FAM001', description: 'Family Support' },
    { code: 'BUS001', description: 'Business Payment' },
    { code: 'SAL001', description: 'Salary Payment' },
    { code: 'EMR001', description: 'Emergency Transfer' },
    { code: 'BIL001', description: 'Bill Payment' },
    { code: 'LEN001', description: 'Loan Payment' },
    { code: 'INV001', description: 'Investment' },
    { code: 'OTH001', description: 'Other Purpose' }
  ];

  // Mock data for user accounts (same as OwnAccountTransfer)
  const userAccounts = [
    { id: '1', number: '1234567890', type: 'Savings', balance: 50000, currency: 'TZS' },
    { id: '2', number: '9876543210', type: 'Current', balance: 100000, currency: 'TZS' },
    { id: '3', number: '5555666677', type: 'Salary', balance: 75000, currency: 'TZS' }
  ];

  // Bank codes for Tanzania
  const bankCodes = [
    { code: 'CRDB', name: 'CRDB Bank' },
    { code: 'NMB', name: 'National Microfinance Bank' },
    { code: 'NBC', name: 'National Bank of Commerce' },
    { code: 'DTB', name: 'Diamond Trust Bank' },
    { code: 'STAN', name: 'Standard Chartered Bank' },
    { code: 'EXIM', name: 'Exim Bank' },
    { code: 'BOA', name: 'Bank of Africa' },
    { code: 'EQUITY', name: 'Equity Bank' },
    { code: 'KCB', name: 'Kenya Commercial Bank' },
    { code: 'ABSA', name: 'Absa Bank' }
  ];

  // Dummy beneficiaries data for To Account dropdown
  const dummyBeneficiaries = [
    {
      id: 1,
      name: 'John Mwalimu',
      accountNumber: '1111222233',
      bankCode: 'CRDB',
      bankName: 'CRDB Bank',
      branchName: 'Dar es Salaam Branch'
    },
    {
      id: 2,
      name: 'Mary Kitwana',
      accountNumber: '4444555566',
      bankCode: 'NMB',
      bankName: 'National Microfinance Bank',
      branchName: 'Mwanza Branch'
    },
    {
      id: 3,
      name: 'Peter Nyerere',
      accountNumber: '7777888899',
      bankCode: 'NBC',
      bankName: 'National Bank of Commerce',
      branchName: 'Arusha Branch'
    },
    {
      id: 4,
      name: 'Grace Mwambega',
      accountNumber: '1122334455',
      bankCode: 'DTB',
      bankName: 'Diamond Trust Bank',
      branchName: 'Dodoma Branch'
    },
    {
      id: 5,
      name: 'Ahmed Hassan',
      accountNumber: '9988776655',
      bankCode: 'STAN',
      bankName: 'Standard Chartered Bank',
      branchName: 'Zanzibar Branch'
    }
  ];

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

  // Initialize payment token on component mount
  useEffect(() => {
    initializePaymentToken();
    return () => {
      clearPaymentSession();
    };
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining > 0 && !tokenExpired) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleTokenExpiry();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeRemaining, tokenExpired]);

  const cancelTransfer = (shouldNavigate = true) => {
    setShowConfirmation(false);
    setShowAuthentication(false);
    setVerifyingAuth(false);
    
    clearPaymentSession();
    
    setFormData({
      fromAccount: '',
      toAccount: '',
      beneficiaryName: '',
      bankCode: '',
      branchName: '',
      creditAmount: '',
      debitAmount: '',
      purposeCode: '',
      description: '',
      transferType: 'immediate'
    });
    
    setFromAccountDisabled(false);
    setToAccountDisabled(true);
    setOtherFieldsDisabled(true);
    
    setErrors({});
    
    if (shouldNavigate) {
      navigate('/transfer');
    }
  };

  // Initialize payment token
  const initializePaymentToken = () => {
    const mockToken = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setPaymentToken(mockToken);
    sessionStorage.setItem('paymentToken', mockToken);
    sessionStorage.setItem('tokenExpiry', (Date.now() + 300000).toString());
    setTimeRemaining(300);
    setTokenExpired(false);
  };

  // Handle token expiry
  const handleTokenExpiry = () => {
    setTokenExpired(true);
    clearPaymentSession();
    setTimeout(() => {
      console.log("Token expired");
      back();
    }, 2000);
  };

  // Clear payment session
  const clearPaymentSession = () => {
    sessionStorage.removeItem('paymentToken');
    sessionStorage.removeItem('tokenExpiry');
    setPaymentToken('');
  };

  // Format time remaining for display
  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

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

    // Handle beneficiary selection from dropdown
    if (name === 'toAccount' && value) {
      const selectedBeneficiary = dummyBeneficiaries.find(ben => ben.id === parseInt(value));
      if (selectedBeneficiary) {
        setFormData(prevState => ({
          ...prevState,
          toAccount: selectedBeneficiary.accountNumber,
          beneficiaryName: selectedBeneficiary.name,
          bankCode: selectedBeneficiary.bankCode,
          branchName: selectedBeneficiary.branchName
        }));
        setToAccountDisabled(true);
        setOtherFieldsDisabled(false);
      }
    }

    if(name === 'fromAccount' && value){
      lookupAccount(name, value);
    }
  };

  function lookupAccount(name, value) {
    const identifierType = "BANK";
    
    if(name === 'fromAccount' && value) { 
      setLoading(true);
      sendLookupRequest(value, identifierType, '')
      .then(response => {
        console.log("From account lookup response:", response);
        if (response.resdetails.primaryarg.acinfo.prielements.status === 'Active') {
            setFromAccountDisabled(true);
            setToAccountDisabled(false);
            setTimeout(() => {
              setLoading(false);
            }, 1000);
            setFormData(prevState => ({
              ...prevState,
              fromAccount: response.resdetails.primaryarg.acinfo.acno
            }));
            setAvailableBalance(response.resdetails.primaryarg.acinfo.secelements.Balance);
          } else {
            setTimeout(() => {
              setLoading(false);
              setModalMessage(t('sourceAccountNotActive'));
              setModalType("from");
              setShowModal(true);
              
              setTimeout(() => {
                setShowModal(false);
                cancelTransfer(false);
              }, 3000);
            }, 1000);
          }
        })
        .catch(error => {
          console.error("Error looking up from account:", error);
          setErrors(prevState => ({
            ...prevState,
            fromAccount: t('errorLookingUpAccount')
          }));
          setLoading(false);
        });
    }
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fromAccount) {
      newErrors.fromAccount = t('pleaseSelectSourceAccount');
    }
    
    if (!formData.toAccount) {
      newErrors.toAccount = t('pleaseSelectBeneficiary');
    }
    
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = t('pleaseEnterBeneficiaryName');
    }
    
    if (!formData.bankCode) {
      newErrors.bankCode = t('pleaseSelectBankCode');
    }
    
    if (!formData.branchName) {
      newErrors.branchName = t('pleaseEnterBranchName');
    }
    
    if (!formData.creditAmount && !formData.debitAmount) {
      newErrors.creditAmount = t('pleaseEnterAmount');
      newErrors.debitAmount = t('pleaseEnterAmount');
    } else {
      const amount = parseFloat(formData.creditAmount || formData.debitAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.creditAmount = t('pleaseEnterValidAmount');
      } else if (amount > availableBalance) {
        newErrors.creditAmount = t('insufficientFunds');
      }
    }
    
    if (!formData.purposeCode) {
      newErrors.purposeCode = t('pleaseSelectPurposeCode');
    }
    
    if (formData.description && formData.description.length > 50) {
      newErrors.description = t('descriptionTooLong');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Add Beneficiary button click
  const handleAddBeneficiary = () => {
    setSelectedModule('beneficiary');
  };

  // Handle confirmation from the separate confirmation component
  const handleConfirmationAccept = () => {
    setIsProcessing(true);
    
    // Simulate confirmation processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      setShowAuthentication(true);
    }, 1000);
  };

  // Handle authentication completion
  const handleAuthenticationComplete = (authData) => {
    setVerifyingAuth(true);
    
    // Simulate authentication verification and payment processing
    setTimeout(() => {
      processTransfer();
    }, 2000);
  };

  // Handle authentication cancellation
  const handleAuthenticationCancel = () => {
    setShowAuthentication(false);
    setShowConfirmation(true);
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

  const processTransfer = () => {
    setIsProcessing(true);
    setLoading(true);
    
    sendPaymentRequest(
      'domestic',
      {
        identifier: formData.fromAccount,
        type: 'BANK'
      },
      {
        identifier: formData.toAccount,
        type: 'BANK',
        bankCode: formData.bankCode
      },
      formData.creditAmount || formData.debitAmount,
    )
      .then(response => {
        console.log("Payment response:", response);
        setTransferResult('success');
        clearPaymentSession();
      })
      .catch(error => {
        console.error("Payment error:", error);
        setTransferResult('failure');
      })
      .finally(() => {
        setLoading(false);
        setIsProcessing(false);
        setShowConfirmation(false);
        setShowAuthentication(false);
        setVerifyingAuth(false);
      });
  };

  const back = () => {
    scrollToTop();
    clearPaymentSession();
    setSelectedModule('');
  };

  const formatAccountNumber = (account) => {
    return `${account.number.slice(0, 4)}...${account.number.slice(-4)} (${account.type}) - TZS ${account.balance.toLocaleString()}`;
  };

  const getSelectedAccount = (accountNumber) => {
    return userAccounts.find(acc => acc.number === accountNumber);
  };

  // Prepare transfer data for confirmation component
  const getTransferDataForConfirmation = () => {
    return {
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount,
      beneficiaryName: formData.beneficiaryName,
      bankCode: formData.bankCode,
      branchName: formData.branchName,
      creditAmount: formData.creditAmount,
      debitAmount: formData.debitAmount,
      purposeCode: formData.purposeCode,
      description: formData.description,
      transferType: formData.transferType
    };
  };

  // Handle schedule transfer
  const handleScheduleTransfer = () => {
    setSelectedModule({type: 'schedule', transferType: 'domestic', data: formData});
  };

  // Render the form
  const renderPaymentForm = () => {
    return (
      <form className="own-form" onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="own-title">{t('domesticTransfer')}</h2>
          {renderSessionTimer()}
        </div>
        
        <div className="own-form-content">
          {/* From Account */}
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
                disabled={fromAccountDisabled}
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

            {/* To Account - Only Dropdown with Add Beneficiary Button */}
            <div className="own-form-group">
              <label className="own-form-label" htmlFor="toAccount">{t('toAccountBeneficiary')}</label>
              <div className="to-account-container">
                <select
                  className={`own-form-select ${errors.toAccount ? 'own-error-input' : ''}`}
                  id="toAccount"
                  name="toAccount"
                  value={formData.toAccount ? dummyBeneficiaries.find(ben => ben.accountNumber === formData.toAccount)?.id || '' : ''}
                  onChange={handleChange}
                  required
                  disabled={toAccountDisabled}
                >
                  <option value="">{t('selectBeneficiary')}</option>
                  {dummyBeneficiaries.map(beneficiary => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.name} - {beneficiary.accountNumber.slice(0, 4)}...{beneficiary.accountNumber.slice(-4)} ({beneficiary.bankCode})
                    </option>
                  ))}
                </select>
                
                <button
                  type="button"
                  className={`m-2 ${toAccountDisabled ? 'btn btn-secondary' : 'action-button'}`}
                  onClick={handleAddBeneficiary}
                  disabled={toAccountDisabled}
                >
                  <FaPlus /> {t('addBeneficiary')}
                </button>
              </div>
              {errors.toAccount && <span className="own-error-message">{errors.toAccount}</span>}
            </div>
          </div>

          {/* Beneficiary Name and Bank Code */}
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
                placeholder={t('enterBeneficiaryNamePlaceholder')}
                required
                disabled={otherFieldsDisabled}
              />
              {errors.beneficiaryName && <span className="own-error-message">{errors.beneficiaryName}</span>}
            </div>

            <div className="own-form-group">
              <label className="own-form-label" htmlFor="bankCode">{t('bankCode')}</label>
              <select
                className={`own-form-select ${errors.bankCode ? 'own-error-input' : ''}`}
                id="bankCode"
                name="bankCode"
                value={formData.bankCode}
                onChange={handleChange}
                required
                disabled={otherFieldsDisabled}
              >
                <option value="">{t('selectBankCodePlaceholder')}</option>
                {bankCodes.map((bank, index) => (
                  <option key={index} value={bank.code}>
                    {bank.code} - {bank.name}
                  </option>
                ))}
              </select>
              {errors.bankCode && <span className="own-error-message">{errors.bankCode}</span>}
            </div>
          </div>

          {/* Branch Name */}
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
                placeholder={t('enterBranchNamePlaceholder')}
                required
                disabled={otherFieldsDisabled}
              />
              {errors.branchName && <span className="own-error-message">{errors.branchName}</span>}
            </div>
          </div>

          {/* Credit and Debit Amount */}
          <div className="own-form-row">
            <div className="own-form-group">
              <label className="own-form-label" htmlFor="creditAmount">{t('creditAmount')}</label>
              <div className="own-amount-input-wrapper">
                <span className="own-currency-symbol">TZS </span>
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
                  disabled={otherFieldsDisabled}
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
                  disabled={otherFieldsDisabled}
                />
              </div>
              {errors.debitAmount && <span className="own-error-message">{errors.debitAmount}</span>}
            </div>
          </div>

          {/* Purpose Code and Description */}
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
                disabled={otherFieldsDisabled}
              >
                <option value="">{t('selectPurposeCodePlaceholder')}</option>
                {purposeCodes.map((purpose, index) => (
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
                placeholder={t('descriptionOptionalPlaceholder')}
                maxLength={50}
                disabled={otherFieldsDisabled}
              />
              <span className="own-form-helper">
                {formData.description.length}/50 {t('charactersCount')}
              </span>
              {errors.description && <span className="own-error-message">{errors.description}</span>}
            </div>
          </div>
        </div>
        
        {/* Button Actions */}
        <div className="own-form-actions">
          <button 
            type="button" 
            className="own-btn own-btn-secondary"
            onClick={back}
          >
            {t('cancel')}
          </button>
          <button 
            type="button" 
            className="own-btn own-btn-schedule"
            onClick={handleScheduleTransfer}
            disabled={otherFieldsDisabled}
          >
            {t('scheduleTransfer')}
          </button>
          <button 
            type="submit" 
            className="own-btn own-btn-primary"
            disabled={isProcessing || loading || otherFieldsDisabled}
          >
            {isProcessing ? t('processing') : t('continue')}
          </button>
        </div>
      </form>
    );
  };

  // Handle going back to transfer services
  const handleBackToServices = () => {
    scrollToTop();
    setFormData({
      fromAccount: '',
      toAccount: '',
      beneficiaryName: '',
      bankCode: '',
      branchName: '',
      creditAmount: '',
      debitAmount: '',
      purposeCode: '',
      description: '',
      transferType: 'immediate'
    });
    setTransferResult(null);
    onTransferComplete('success', '');
    setSelectedModule("")
  };
  
  // Handle retry after failure
  const handleRetry = () => {
    setTransferResult(null);
    setShowConfirmation(true);
  };
  
  // Prepare transfer details for success/failure pages
  const getTransferDetails = () => {
    const fromAccount = getSelectedAccount(formData.fromAccount);
    const selectedPurpose = purposeCodes.find(p => p.code === formData.purposeCode);
    const selectedBank = bankCodes.find(b => b.code === formData.bankCode);
    
    return {
      fromAccount: fromAccount ? `${fromAccount.number} (${fromAccount.type})` : '',
      toAccount: `${formData.toAccount} (${formData.beneficiaryName})`,
      bankName: selectedBank ? selectedBank.name : formData.bankCode,
      branchName: formData.branchName,
      amount: formData.creditAmount || formData.debitAmount,
      purposeCode: selectedPurpose ? `${selectedPurpose.code} - ${selectedPurpose.description}` : formData.purposeCode,
      description: formData.description,
      transferType: formData.transferType === 'immediate' ? t('immediateTransferType') : t('scheduledTransfer'),
      errorMessage: t('transactionCouldNotBeCompleted')
    };
  };

  // Render global loader component
  const renderLoader = () => {
    if (!loading) return null;
    
    return (
      <div className="layout-loader">
        <ScaleLoader color="#0056b3" />
      </div>
    );
  };

  // Render alert modal
  const renderAlertModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="alert-modal-overlay">
        <div className="alert-modal">
          <div className="alert-modal-icon">
            <FaExclamationTriangle size={30} />
          </div>
          <h3>{t('accountNotActive')}</h3>
          <p>{modalMessage}</p>
          <button 
            className="alert-modal-close" 
            onClick={() => {
              setShowModal(false);
              cancelTransfer(false);
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  // Render session timer component
  const renderSessionTimer = () => {
    if (tokenExpired) {
      return (
        <div className="session-timer expired">
          <FaExclamationTriangle className="timer-icon" />
          <span className="timer-text">{t('sessionExpiredRedirecting')}</span>
        </div>
      );
    }

    return (
      <div className={`session-timer ${timeRemaining <= 60 ? 'warning' : ''}`}>
        <FaClock className="timer-icon" />
        <span className="timer-text">
          {t('sessionExpiresIn')}: <strong>{formatTimeRemaining(timeRemaining)}</strong>
        </span>
      </div>
    );
  };

  return (
    <>
      {renderLoader()}
      {renderAlertModal()}
      <div className="container">
        {transferResult === 'success' ? (
          <TransferSuccess 
            paymentType="domestic" 
            transferDetails={getTransferDetails()} 
            onStartNew={handleBackToServices} 
          />
        ) : transferResult === 'failure' ? (
          <TransferFailure 
            paymentType="domestic" 
            transferDetails={getTransferDetails()} 
            onRetry={handleRetry}
            onStartNew={handleBackToServices} 
          />
        ) : showConfirmation ? (
          <TransferConfirmation
            transferData={getTransferDataForConfirmation()}
            paymentType="domestic"
            onConfirm={handleConfirmationAccept}
            onCancel={cancelTransfer}
            loading={isProcessing}
            renderSessionTimer={renderSessionTimer}
          />
        ) : showAuthentication ? (
          <TransferAuthentication
            onAuthenticate={handleAuthenticationComplete}
            onCancel={handleAuthenticationCancel}
            loading={loading}
            verifyingAuth={verifyingAuth}
            renderSessionTimer={renderSessionTimer}
          />
        ) : (
          renderPaymentForm()
        )}
      </div>
    </>
  );
};

export default DomesticTransfer;
