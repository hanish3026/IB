import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/OverAllPaymentsPage.css';
import TransferSuccess from './TransferSuccess';
import TransferFailure from './TransferFailure';
import { FaShieldAlt, FaExclamationTriangle, FaClock, FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa';
import useScrollToTop from '../../../hooks/useScrollToTop';
import { sendPaymentRequest } from '../../../PaymentApi/sendPaymentRequest';
import { sendRequestToPayRequest } from '../../../PaymentApi/requestToPay';
import { sendLookupRequest } from '../../../PaymentApi/sendLookupRequest';
import { sendOtpRequest } from '../../../PaymentApi/sendOtpRequest';
import { ScaleLoader } from "react-spinners";

// Tanzanian bank FSC codes with bank numbers
const tanzanianBanks = [
  { name: "CRDB Bank", fscCode: "CRDBTZTZ", code: "01" },
  { name: "National Microfinance Bank (NMB)", fscCode: "NMIBTZTZ", code: "02" },
  { name: "National Bank of Commerce (NBC)", fscCode: "NLCBTZTZ", code: "03" },
  { name: "Exim Bank Tanzania", fscCode: "EXTNTZTZ", code: "04" },
  { name: "Stanbic Bank Tanzania", fscCode: "SBICTZTZ", code: "05" },
  { name: "Standard Chartered Bank Tanzania", fscCode: "SCBLTZTZ", code: "06" },
  { name: "Diamond Trust Bank Tanzania", fscCode: "DTKETZTZ", code: "07" },
  { name: "Citibank Tanzania", fscCode: "CITITZTZ", code: "08" },
  { name: "Barclays Bank Tanzania", fscCode: "BARCTZTZ", code: "09" },
  { name: "Bank of Africa Tanzania", fscCode: "EUAFTZTZ", code: "10" },
  { name: "Equity Bank Tanzania", fscCode: "EQBLTZTZ", code: "11" },
  { name: "I&M Bank Tanzania", fscCode: "IMBLTZTZ", code: "12" },
  { name: "KCB Bank Tanzania", fscCode: "KCBLTZTZ", code: "13" },
  { name: "TIB Corporate Bank", fscCode: "TBTZTZTZ", code: "14" },
  { name: "Azania Bank", fscCode: "AZANTZTZ", code: "15" },
  { name: "Akiba Commercial Bank", fscCode: "ACBLTZTZ", code: "16" },
  { name: "Bank of India Tanzania", fscCode: "BKIDTZTZ", code: "17" },
  { name: "Ecobank Tanzania", fscCode: "ECOCTZTZ", code: "18" },
  { name: "Tanzania Postal Bank", fscCode: "TPOSTZTZ", code: "19" },
  { name: "People's Bank of Zanzibar", fscCode: "PBZATZTZ", code: "20" }
];

const RequestToPay = ({ onRequestComplete, setSelectedModule }) => {
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
    amount: '',
    description: '',
    FSCCode: '',
    beneficiaryName: '',
    bankName: '',
    remarks: ''
  });
  
  const [errors, setErrors] = useState({});
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '' });
  const [requestResult, setRequestResult] = useState(null); // 'success', 'failure', or null
  
  // OTP States
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

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
      // if (selectedAccount) {
      //   setAvailableBalance(selectedAccount.balance);
      // }
    } else {
      setAvailableBalance(0);
    }
  }, [formData.fromAccount]);

  // Initialize payment token on component mount
  useEffect(() => {
    initializePaymentToken();
    return () => {
      // Cleanup timer on unmount
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

  const cancelRequest = (shouldNavigate = true) => {
    setShowConfirmation(false);
    setShowOTP(false);
    
    // Clear payment session and redirect to transfer services
    clearPaymentSession();
    
    // Reset the form to clear any input data
    setFormData({
      fromAccount: '',
      toAccount: '',
      amount: '',
      description: '',
      beneficiaryName: '',
      bankName: '',
      FSCCode: '',
      remarks: ''
    });
    
    // Reset field disable states
    setFromAccountDisabled(false);
    setToAccountDisabled(true);
    setOtherFieldsDisabled(true);
    
    setErrors({});
    setSearchQuery({ from: '', to: '' });
    
    // Navigate to transfer services
    if (shouldNavigate) {
      navigate('/transfer');
    }
  };

  // Initialize payment token (simulate API call)
  const initializePaymentToken = () => {
    // Simulate API call to get payment token
    const mockToken = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setPaymentToken(mockToken);
    sessionStorage.setItem('requestToken', mockToken);
    sessionStorage.setItem('tokenExpiry', (Date.now() + 300000).toString()); // 5 minutes from now
    setTimeRemaining(300);
    setTokenExpired(false);
    console.log("Token initialized");
  };

  // Handle token expiry
  const handleTokenExpiry = () => {
    setTokenExpired(true);
    clearPaymentSession();
    // Show expiry message and redirect
    setTimeout(() => {
      console.log("Token expired");
      back();
    }, 2000);
  };

  // Clear payment session
  const clearPaymentSession = () => {
    console.log("Clearing payment session");
    sessionStorage.removeItem('requestToken');
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

    // Auto-fill bank name when FSC code is selected
    if (name === 'FSCCode' && value) {
      const selectedBank = tanzanianBanks.find(bank => bank.fscCode === value);
      if (selectedBank) {
        setFormData(prevState => ({
          ...prevState,
          bankName: selectedBank.name
        }));
      }
    }

    if(name === 'fromAccount' || name === 'toAccount'){
      lookupAccount(name, value);
    }
  };

  function lookupAccount(name, value) {
    const identifierType = "BANK";
    
    if(name === 'fromAccount' && value) { 
      setLoading(true);
      console.log("Loading", loading);  
      // Pass token to API call
      sendLookupRequest(value, identifierType, formData.FSCCode)
      .then(response => {
        console.log("From account lookup response:", response);
        if (response.resdetails.primaryarg.acinfo.prielements.status === 'Active') {
            // Enable To Account field and disable From Account field
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
              
              // Auto-close modal after 3 seconds
              setTimeout(() => {
                setShowModal(false);
                cancelRequest(false); // Reset form without navigating away
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
        sendLookupRequest(value, identifierType, formData.FSCCode)
          .then(response => {
            console.log("To account lookup response:", response);
            if (response.resdetails.primaryarg.acinfo.prielements.status === 'Active') {
              // Enable all other fields and disable To Account field
              setToAccountDisabled(true);
              setOtherFieldsDisabled(false);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
              // Update form data with account info if available
              setFormData(prevState => ({
                ...prevState,
                toAccount: response.resdetails.primaryarg.acinfo.acno,
                beneficiaryName: response.resdetails.primaryarg.acinfo.secelements.fullname
              }));
            } else {
              setTimeout(() => {
                setLoading(false);
                setModalMessage("The beneficiary account you have chosen is not active. Please choose another account.");
                setModalType("to");
                setShowModal(true);
                
                // Auto-close modal after 3 seconds
                setTimeout(() => {
                  setShowModal(false);
                  cancelRequest(false); // Reset form without navigating away
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

  const handleAccountSearch = (e, accountType) => {
    const { value } = e.target;
    setSearchQuery(prev => ({
      ...prev,
      [accountType]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Please select your account';
    }
    
    if (!formData.toAccount) {
      newErrors.toAccount = 'Please enter payer account number';
    } else if (!/^[0-9]{10}$/.test(formData.toAccount)) {
      newErrors.toAccount = 'Account number should be 10 digits';
    }
    
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = 'Please enter payer name';
    } else if (formData.beneficiaryName.length < 3) {
      newErrors.beneficiaryName = 'Name should be at least 3 characters';
    }
    
    if (!formData.FSCCode) {
      newErrors.FSCCode = 'Please select a bank FSC code';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Please enter an amount';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (parseFloat(formData.amount) > 1000000) {
      newErrors.amount = 'Amount exceeds maximum request limit of TZS 10,00,000';
    }
    
    if (formData.remarks && formData.remarks.length > 50) {
      newErrors.remarks = 'Remarks cannot exceed 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // OTP Functions
  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otpValue];
      newOTP[index] = value;
      setOtpValue(newOTP);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
      
      if (otpError) setOtpError('');
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    console.log("formData",formData);
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

  const confirmRequest = () => {
    scrollToTop();
    setLoading(true);
    const currentToken = sessionStorage.getItem('requestToken');
    sendOtpRequest(formData.fromAccount, "BANK", "REQUEST", "self")
      .then(response => {
        console.log("OTP response:", response);
        if(response.result === "success"){
          setShowOTP(true);
        }
      })
      .catch(error => {
        console.error("Error sending OTP:", error);
        setOtpError('Failed to send OTP. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
    setResendTimer(30);
    setCanResend(false);
  };

  const verifyOTP = () => {
    const otp = otpValue.join('');
    if (otp.length !== 6) {
      setOtpError('Please enter complete OTP');
      return;
    }
    
    setVerifyingOTP(true);
    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setVerifyingOTP(false);
      
      if (otp === '123456') { // Demo OTP
        processRequest();
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setLoading(false);
      }
    }, 2000);
  };

  const processRequest = () => {
    setIsProcessing(true);
    setLoading(true);
    const currentToken = sessionStorage.getItem('requestToken');
    
    // Get selected bank for FSC code mapping
    const selectedBank = tanzanianBanks.find(bank => bank.fscCode === formData.FSCCode);
    
    // Send the request to pay with token
    sendRequestToPayRequest(
      {
        identifier: formData.fromAccount,
        type: 'BANK',
        bankCode: '013', // Your bank code
        name: 'Your Account' // Could be retrieved from account lookup
      },
      {
        identifier: formData.toAccount,
        type: 'BANK',
        bankCode: selectedBank ? selectedBank.code : '038',
        name: formData.beneficiaryName
      },
      formData.amount,
      formData.remarks || 'Payment request'
    )
      .then(response => {
        console.log("Request to Pay response:", response);
        setRequestResult('success');
        // Clear session after successful request
        // clearPaymentSession();
      })
      .catch(error => {
        console.error("Request to Pay error:", error);
        setRequestResult('failure');
      })
      .finally(() => {
        setLoading(false);
        setIsProcessing(false);
        setShowConfirmation(false);
        setShowOTP(false);
      });
  };

  const back = () => {
    scrollToTop();
    console.log("button pressed")
    // Clear session when going back
    clearPaymentSession();
    setSelectedModule('');
  };

  const formatAccountNumber = (account) => {
    return `${account.number.slice(0, 4)}...${account.number.slice(-4)} (${account.type})`;
  };

  // Get selected account details
  const getSelectedAccount = (accountNumber) => {
    return userAccounts.find(acc => acc.number === accountNumber);
  };

  const fromAccount = getSelectedAccount(formData.fromAccount);

  const resendOTP = () => {
    setCanResend(false);
    setResendTimer(30);
    setOtpValue(['', '', '', '', '', '']);
    setOtpError('');
    console.log('OTP resent');
  };

  // OTP Timer effect
  useEffect(() => {
    let interval;
    if (showOTP && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => {
          if (timer <= 1) {
            setCanResend(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, resendTimer]);

  // Render OTP Module
  const renderOTPModule = () => (
    <div className="otp-overlay">
      <div className="otp-container">
        <div className="otp-header">
          <FaShieldAlt className="otp-icon" />
          <h3>{t('verifyOtp')}</h3>
          <p>{t('weSentOtpToMobile')}</p>
          <strong>{formData.phone || "XXXXXX1234"}</strong>
        </div>
        
        <div className="otp-input-container">
          {otpValue.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleOTPKeyDown(index, e)}
              className={`otp-input ${otpError ? 'error' : ''}`}
            />
          ))}
        </div>
        
        {otpError && (
          <div className="error-message otp-error">{otpError}</div>
        )}
        
        <div className="otp-timer">
          {!canResend ? (
            <span>{t('resendOtpIn')} {resendTimer}s</span>
          ) : (
            <button type="button" className="resend-btn" onClick={resendOTP}>
              {t('resendOtp')}
            </button>
          )}
        </div>
        
        <div className="otp-actions">
          <button
            type="button"
            className="otp-verify-btn"
            onClick={verifyOTP}
            disabled={verifyingOTP || otpValue.join('').length !== 6}
          >
            {verifyingOTP ? (
              <>
                <span className="spinner"></span>
                {t('verifying')}...
              </>
            ) : (
              t('verifyAndProceed')
            )}
          </button>
          <button
            type="button"
            className="otp-back-btn"
            onClick={() => setShowOTP(false)}
          >
            {t('backToForm')}
          </button>
        </div>
        
        <div className="otp-demo-hint">
          <small>{t('demoOtp')}</small>
        </div>
      </div>
    </div>
  );

  // Render the request form
  const renderRequestForm = () => {
    const formClassName = `within-form`;
    const errorClassName = `within-error-input`;
    const errorMessageClassName = `within-error-message`;
    
    return (
      <form className={formClassName} onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className={`within-title`}>{t('requestToPay')}</h2>
          {renderSessionTimer()}
        </div>
        
        <div className={`within-form-content`}>
          {/* From Account (Your Account) */}
          <div className={`within-form-row`}>
            <div className={`within-form-group`}>
              <label className={`within-form-label`} htmlFor="fromAccount">{t('yourAccount')}</label>
              <select
                className={`within-form-select ${errors.fromAccount ? errorClassName : ''}`}
                id="fromAccount"
                name="fromAccount"
                value={formData.fromAccount}
                onChange={(e) => {
                  handleChange(e);
                  handleAccountSearch(e, 'from');
                }}
                required
                disabled={fromAccountDisabled}
              >
                <option value="">{t('selectYourAccount')}</option>
                {userAccounts
                  .filter(account => 
                    !searchQuery.from || 
                    account.number.toLowerCase().includes(searchQuery.from.toLowerCase()) ||
                    account.type.toLowerCase().includes(searchQuery.from.toLowerCase())
                  )
                  .map(account => (
                    <option key={account.id} value={account.number}>
                      {formatAccountNumber(account)}
                    </option>
                  ))}
              </select>
              {errors.fromAccount && <span className={errorMessageClassName}>{errors.fromAccount}</span>}
{/*               
              {formData.fromAccount && (
                <div className={`within-account-info`}>
                  <span className={`within-account-balance`}>Available Balance: TZS {availableBalance.toLocaleString()}</span>
                </div>
              )} */}
            </div>

            {/* Payer Account */}
            <div className={`within-form-group`}>
              <label className={`within-form-label`} htmlFor="toAccount">{t('payerAccountNumber')}</label>
              <input
                type="text"
                className={`within-form-input ${errors.toAccount ? errorClassName : ''}`}
                id="toAccount"
                name="toAccount"
                value={formData.toAccount}
                onChange={handleChange}
                placeholder={t('enterPayerAccountNumber')}
                required
                maxLength={10}
                disabled={toAccountDisabled}
              />
              {errors.toAccount ? (
                <span className={errorMessageClassName}>{errors.toAccount}</span>
              ) : (
                <span className={`within-form-helper`}>{t('accountNumberShouldBe10Digits')}</span>
              )}
            </div>
          </div>

          {/* Payer Name and Bank/FSC */}
          <div className={`within-form-row`}>
            <div className={`within-form-group`}>
              <label className={`within-form-label`} htmlFor="beneficiaryName">{t('payerName')}</label>
              <input
                type="text"
                className={`within-form-input ${errors.beneficiaryName ? errorClassName : ''}`}
                id="beneficiaryName"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={handleChange}
                placeholder={t('enterPayerName')}
                required
                disabled={otherFieldsDisabled}
              />
              {errors.beneficiaryName && <span className={errorMessageClassName}>{errors.beneficiaryName}</span>}
            </div>

            <div className={`within-form-group`}>
              <label className={`within-form-label`} htmlFor="FSCCode">{t('bankAndFscCode')}</label>
              <select
                className={`within-form-select ${errors.FSCCode ? errorClassName : ''}`}
                id="FSCCode"
                name="FSCCode"
                value={formData.FSCCode}
                onChange={handleChange}
                required
                disabled={otherFieldsDisabled}
              >
                <option value="">{t('selectBank')}</option>
                {tanzanianBanks.map((bank, index) => (
                  <option key={index} value={bank.fscCode}>
                    {bank.name} ({bank.fscCode})
                  </option>
                ))}
              </select>
              {errors.FSCCode && <span className={errorMessageClassName}>{errors.FSCCode}</span>}
            </div>
          </div>

          {/* Amount and Remarks */}
          <div className={`within-form-row`}>
            <div className={`within-form-group`}>
              <label className={`within-form-label`} htmlFor="amount">{t('amount')}</label>
              <div className={`within-amount-input-wrapper`}>
                <span className={`within-currency-symbol`}>TZS </span>
                <input
                  type="number"
                  className={`within-form-input ${errors.amount ? errorClassName : ''}`}
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  min="1"
                  step="0.01"
                  disabled={otherFieldsDisabled}
                />
              </div>
              {errors.amount ? (
                <span className={errorMessageClassName}>{errors.amount}</span>
              ) : (
                <span className={`within-form-helper`}>{t('maximumRequestLimit')}</span>
              )}
            </div>

            <div className={`within-form-group`}>
              <label className={`within-form-label`} htmlFor="remarks">{t('remarksOptional')}</label>
              <input
                type="text"
                className={`within-form-input ${errors.remarks ? errorClassName : ''}`}
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder={t('remarksPlaceholder')}
                maxLength={50}
                disabled={otherFieldsDisabled}
              />
              <span className={`within-form-helper`}>
                {formData.remarks.length}/50 {t('characters')}
              </span>
              {errors.remarks && <span className={errorMessageClassName}>{errors.remarks}</span>}
            </div>
          </div>
        </div>
        
        {/* Button Actions */}
        <div className={`within-form-actions`}>
          <button 
            type="button" 
            className={`within-btn within-btn-secondary`}
            onClick={back}
          >
            {t('cancel')}
          </button>
          <button 
            type="submit" 
            className={`within-btn within-btn-primary`}
            disabled={isProcessing || loading || otherFieldsDisabled}
          >
            {isProcessing ? t('processing') : t('continue')}
          </button>
        </div>
      </form>
    );
  };

  // Render confirmation page
  const renderConfirmation = () => {
    // Get the bank name for the selected FSC code
    const selectedBank = tanzanianBanks.find(bank => bank.fscCode === formData.FSCCode);
    const bankName = selectedBank ? selectedBank.name : '';
    
    return (
      <div className="neft-confirmation">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="neft-title">{t('confirmRequestToPay')}</h2>
          {renderSessionTimer()}
        </div>
        
        <div className="neft-confirmation-details">
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('yourAccount')}:</span>
            <span className="neft-confirmation-value">
              {fromAccount ? `${fromAccount.number} (${fromAccount.type})` : ''}
            </span>
          </div>
          
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('payerAccount')}:</span>
            <span className="neft-confirmation-value">{formData.toAccount}</span>
          </div>
          
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('payerName')}:</span>
            <span className="neft-confirmation-value">{formData.beneficiaryName}</span>
          </div>
          
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('bankAndFscCode')}:</span>
            <span className="neft-confirmation-value">
              {bankName} - {selectedBank ? selectedBank.code : ''} ({formData.FSCCode})
            </span>
          </div>
          
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">{t('amount')}:</span>
            <span className="neft-confirmation-value neft-amount">
              TZS {parseFloat(formData.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </div>
          
          {formData.remarks && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">{t('remarks')}:</span>
              <span className="neft-confirmation-value">{formData.remarks}</span>
            </div>
          )}
        </div>
        
        <div className="neft-timing-info">
          <strong>{t('note')}:</strong> {t('paymentRequestWillBeSent')}
        </div>
        
        <div className="neft-confirmation-actions">
          <button 
            className="own-btn own-btn-secondary"
            onClick={back}
            disabled={isProcessing || loading}
          >
            {t('cancel')}
          </button>
          <button 
            className="own-btn own-btn-primary"
            onClick={confirmRequest}
            disabled={isProcessing || loading}
          >
            {isProcessing ? (
              <span className="neft-processing">
                <span className="neft-spinner"></span>
                {t('processing')}...
              </span>
            ) : t('sendRequest')}
          </button>
        </div>
      </div>
    );
  };

  // Custom Success Component for Request to Pay
  const RequestSuccess = ({ requestDetails, onStartNew }) => {
    const transactionId = 'REQ' + Math.floor(Math.random() * 100000000);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div className="transfer-success">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        
        <h2 className="success-title">{t('requestSentSuccessfully')}</h2>
        <p className="success-message">
          {t('paymentRequestSentSuccessfully')}
        </p>
        
        <div className="receipt-card">
          <div className="receipt-header">
            <div className="transfer-type-icon">
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>
            <div className="transfer-details">
              <h3>{t('requestToPay')}</h3>
              <p>{t('paymentRequest')}</p>
            </div>
          </div>
          
          <div className="receipt-details">
            <div className="receipt-row">
              <span className="receipt-label">{t('requestId')}</span>
              <span className="receipt-value">{transactionId}</span>
            </div>
            
            <div className="receipt-row">
              <span className="receipt-label">{t('dateTime')}</span>
              <span className="receipt-value">{currentDate}</span>
            </div>
            
            <div className="receipt-row">
              <span className="receipt-label">{t('yourAccount')}</span>
              <span className="receipt-value">{requestDetails.fromAccount}</span>
            </div>
            
            <div className="receipt-row">
              <span className="receipt-label">{t('payerAccount')}</span>
              <span className="receipt-value">{requestDetails.toAccount}</span>
            </div>
            
            <div className="receipt-row">
              <span className="receipt-label">{t('payerName')}</span>
              <span className="receipt-value">{requestDetails.beneficiaryName}</span>
            </div>
            
            <div className="receipt-row">
              <span className="receipt-label">{t('bankAndFscCode')}</span>
              <span className="receipt-value">{requestDetails.bankName} ({requestDetails.FSCCode})</span>
            </div>
            
            <div className="receipt-row">
              <span className="receipt-label">{t('amount')}</span>
              <span className="receipt-value receipt-amount">
                TZS {parseFloat(requestDetails.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            
            {requestDetails.description && (
              <div className="receipt-row">
                <span className="receipt-label">{t('remarks')}</span>
                <span className="receipt-value">{requestDetails.description}</span>
              </div>
            )}
            
            <div className="receipt-row">
              <span className="receipt-label">{t('status')}</span>
              <span className="receipt-value receipt-status success-receipt-icon">
                <FaCheckCircle className='success-receipt-icon' /> {t('requestSent')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="transfer-note">
          <strong>{t('note')}:</strong> {t('payerWillReceiveNotification')}
        </div>
        
        <div className="success-actions">
          <button 
            className="action-btn secondary-btn"
            onClick={() => {
              // Download receipt functionality would go here
              alert('Receipt download functionality would be implemented here');
            }}
          >
            <FaDownload /> {t('downloadReceipt')}
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

  // Handle going back to transfer services
  const handleBackToServices = () => {
    scrollToTop();
    // Reset form
    setSelectedModule('');
    setFormData({
      fromAccount: '',
      toAccount: '',
      amount: '',
      description: '',
      beneficiaryName: '',
      bankName: '',
      FSCCode: '',
      remarks: ''
    });
    setSearchQuery({ from: '', to: '' });
    setRequestResult(null);
    handleTokenExpiry();
    // Just go back to transfer options without showing a message
    onRequestComplete && onRequestComplete('success', '');
  };
  
  // Handle retry after failure
  const handleRetry = () => {
    setRequestResult(null);
    setShowConfirmation(true);
  };
  
  // Prepare request details for success/failure pages
  const getRequestDetails = () => {
    const fromAccount = getSelectedAccount(formData.fromAccount);
    const selectedBank = tanzanianBanks.find(bank => bank.fscCode === formData.FSCCode);
    
    return {
      fromAccount: fromAccount ? `${fromAccount.number} (${fromAccount.type})` : '',
      toAccount: formData.toAccount,
      beneficiaryName: formData.beneficiaryName,
      bankName: selectedBank ? selectedBank.name : '',
      FSCCode: formData.FSCCode,
      amount: formData.amount,
      description: formData.remarks,
      errorMessage: 'The request could not be sent due to a temporary system issue. Please try again.'  // Mock error message
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
              cancelRequest(false); // Reset form without navigating away
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
        {requestResult === 'success' ? (
          <RequestSuccess 
            requestDetails={getRequestDetails()} 
            onStartNew={handleBackToServices} 
          />
        ) : requestResult === 'failure' ? (
          <TransferFailure 
            paymentType='request'
            transferDetails={getRequestDetails()} 
            onRetry={handleRetry}
            onStartNew={handleBackToServices} 
          />
        ) : (
          <>
            {showConfirmation ? renderConfirmation() : renderRequestForm()}
            {showOTP && renderOTPModule()}
          </>
        )}
      </div>
    </>
  );
};

export default RequestToPay;