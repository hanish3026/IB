import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/OverAllPaymentsPage.css';
import TransferSuccess from './TransferSuccess';
import TransferFailure from './TransferFailure';
import TransferConfirmation from './TransferConfirmation';
import TransferAuthentication from './TransferAuthentication';
import { FaShieldAlt, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import useScrollToTop from '../../../hooks/useScrollToTop';
import { sendPaymentRequest } from '../../../PaymentApi/sendPaymentRequest';
import { sendLookupRequest } from '../../../PaymentApi/sendLookupRequest';
import { sendOtpRequest } from '../../../PaymentApi/sendOtpRequest';
import { ScaleLoader } from "react-spinners";

const OwnAccountTransfer = ({ onTransferComplete, setSelectedModule }) => {
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
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '' });
  const [transferResult, setTransferResult] = useState(null); // 'success', 'failure', or null
  
  // Component states for new flow
  const [showAuthentication, setShowAuthentication] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(false);

  // Purpose codes for own account transfer
  const purposeCodes = [
    { code: 'SAV001', description: 'Savings to Current Transfer' },
    { code: 'CUR001', description: 'Current to Savings Transfer' },
    { code: 'SAL001', description: 'Salary Account Transfer' },
    { code: 'INV001', description: 'Investment Transfer' },
    { code: 'EMR001', description: 'Emergency Transfer' },
    { code: 'BIL001', description: 'Bill Payment Preparation' },
    { code: 'OTH001', description: 'Other Purpose' }
  ];

  // Mock data for demo purposes
  const userAccounts = [
    { id: '1', number: '1234567890', type: 'Savings', balance: 50000, currency: 'TZS' },
    { id: '2', number: '9876543210', type: 'Current', balance: 100000, currency: 'TZS' },
    { id: '3', number: '5555666677', type: 'Salary', balance: 75000, currency: 'TZS' }
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
    setSearchQuery({ from: '', to: '' });
    
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

    if(name === 'fromAccount' || name === 'toAccount'){
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
              setModalMessage("The source account you have chosen is not active. Please choose another account.");
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
            fromAccount: 'Error looking up account'
          }));
          setLoading(false);
        });
    }
    
    if(name === 'toAccount' && value.length >= 10) {
      setTimeout(() => {
        setLoading(true);
        sendLookupRequest(value, identifierType, '')
          .then(response => {
            console.log("To account lookup response:", response);
            if (response.resdetails.primaryarg.acinfo.prielements.status === 'Active') {
              setToAccountDisabled(true);
              setOtherFieldsDisabled(false);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
              setFormData(prevState => ({
                ...prevState,
                toAccount: response.resdetails.primaryarg.acinfo.acno
              }));
            } else {
              setTimeout(() => {
                setLoading(false);
                setModalMessage("The destination account you have chosen is not active. Please choose another account.");
                setModalType("to");
                setShowModal(true);
                
                setTimeout(() => {
                  setShowModal(false);
                  cancelTransfer(false);
                }, 3000);
              }, 1000);
            }
          })
          .catch(error => {
            console.error("Error looking up to account:", error);
            setErrors(prevState => ({
              ...prevState,
              toAccount: 'Error looking up account'
            }));
            setLoading(false);
          });
      }, 1000);  
    }
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Please select a source account';
    }
    
    if (!formData.toAccount) {
      newErrors.toAccount = 'Please select a destination account';
    }
    
    if (formData.fromAccount && formData.toAccount && formData.fromAccount === formData.toAccount) {
      newErrors.toAccount = 'Source and destination accounts cannot be the same';
    }
    
    if (!formData.creditAmount && !formData.debitAmount) {
      newErrors.creditAmount = 'Please enter either credit or debit amount';
      newErrors.debitAmount = 'Please enter either credit or debit amount';
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
    
    if (formData.description && formData.description.length > 50) {
      newErrors.description = 'Description cannot exceed 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // OTP Functions
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

  const confirmTransfer = () => {
    // Simply move to confirmation view - the separate component will handle the rest
    setShowConfirmation(true);
  };



  const processTransfer = () => {
    setIsProcessing(true);
    setLoading(true);
    
    sendPaymentRequest(
      'own',
      {
        identifier: formData.fromAccount,
        type: 'BANK'
      },
      {
        identifier: formData.toAccount,
        type: 'BANK'
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
      creditAmount: formData.creditAmount,
      debitAmount: formData.debitAmount,
      purposeCode: formData.purposeCode,
      description: formData.description,
      transferType: formData.transferType
    };
  };

  // Handle schedule transfer
  const handleScheduleTransfer = () => {
    setSelectedModule({type: 'schedule', transferType: 'own', data: formData});

  };



  // Render the form
  const renderPaymentForm = () => {
    return (
      <form className="own-form" onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="own-title">{t('transferBetweenYourAccounts')}</h2>
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

            {/* To Account */}
            <div className="own-form-group">
              <label className="own-form-label" htmlFor="toAccount">{t('toAccount')}</label>
              <select
                className={`own-form-select ${errors.toAccount ? 'own-error-input' : ''}`}
                id="toAccount"
                name="toAccount"
                value={formData.toAccount}
                onChange={handleChange}
                required
                disabled={toAccountDisabled}
              >
                <option value="">{t('selectDestinationAccount')}</option>
                {userAccounts
                  .filter(account => account.number !== formData.fromAccount)
                  .map(account => (
                    <option key={account.id} value={account.number}>
                      {formatAccountNumber(account)}
                    </option>
                  ))}
              </select>
              {errors.toAccount && <span className="own-error-message">{errors.toAccount}</span>}
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
                <option value="">{t('selectPurposeCode')}</option>
                {purposeCodes.map((purpose, index) => (
                  <option key={index} value={purpose.code}>
                    {purpose.code} - {purpose.description}
                  </option>
                ))}
              </select>
              {errors.purposeCode && <span className="own-error-message">{errors.purposeCode}</span>}
            </div>

            <div className="own-form-group">
              <label className="own-form-label" htmlFor="description">{t('description')}</label>
              <input
                type="text"
                className={`own-form-input ${errors.description ? 'own-error-input' : ''}`}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('descriptionPlaceholder')}
                maxLength={50}
                disabled={otherFieldsDisabled}
              />
              <span className="own-form-helper">
                {formData.description.length}/50 {t('characters')}
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
            {t('scheduleTransferBtn')}
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
      creditAmount: '',
      debitAmount: '',
      purposeCode: '',
      description: '',
      transferType: 'immediate'
    });
    setSearchQuery({ from: '', to: '' });
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
    const toAccount = getSelectedAccount(formData.toAccount);
    const selectedPurpose = purposeCodes.find(p => p.code === formData.purposeCode);
    
    return {
      fromAccount: fromAccount ? `${fromAccount.number} (${fromAccount.type})` : '',
      toAccount: toAccount ? `${toAccount.number} (${toAccount.type})` : '',
      amount: formData.creditAmount || formData.debitAmount,
      purposeCode: selectedPurpose ? `${selectedPurpose.code} - ${selectedPurpose.description}` : formData.purposeCode,
      description: formData.description,
      transferType: formData.transferType === 'immediate' ? 'Immediate Transfer' : 'Scheduled Transfer',
      errorMessage: 'The transaction could not be completed due to a temporary system issue. Please try again.'
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
          <h3>Account Not Active</h3>
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
          <span className="timer-text">Session Expired - Redirecting...</span>
        </div>
      );
    }

    return (
      <div className={`session-timer ${timeRemaining <= 60 ? 'warning' : ''}`}>
        <FaClock className="timer-icon" />
        <span className="timer-text">
          Session expires in: <strong>{formatTimeRemaining(timeRemaining)}</strong>
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
            paymentType="own" 
            transferDetails={getTransferDetails()} 
            onStartNew={handleBackToServices} 
          />
        ) : transferResult === 'failure' ? (
          <TransferFailure 
            paymentType="own" 
            transferDetails={getTransferDetails()} 
            onRetry={handleRetry}
            onStartNew={handleBackToServices} 
          />
        ) : showConfirmation ? (
          <TransferConfirmation
            transferData={getTransferDataForConfirmation()}
            paymentType="own"
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

export default OwnAccountTransfer;
