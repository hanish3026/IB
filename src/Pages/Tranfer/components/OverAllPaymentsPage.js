import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/OverAllPaymentsPage.css';
import TransferSuccess from './TransferSuccess';
import TransferFailure from './TransferFailure';
import { FaShieldAlt, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import useScrollToTop from '../../../hooks/useScrollToTop';
import { sendPaymentRequest } from '../../../PaymentApi/sendPaymentRequest';
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

// Mobile Network Operators (MNO) in Tanzania
const mnoProviders = [
  { name: "T-Pesa (TTCL)", code: "TPESA" },
  { name: "M-Pesa (Vodacom)", code: "MPESA" },
  { name: "Tigo Pesa", code: "TIGOPESA" },
  { name: "Airtel Money", code: "AIRTELMONEY" },
  { name: "Halotel Money", code: "HALOTELMONEY" },
  { name: "Ezy Pesa", code: "EZYPESA" }
];

const OverAllPaymentsPage = ({ paymentType, onTransferComplete, selectedBeneficiary, setSelectedModule }) => {
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
    // Common fields for all payment types
    fromAccount: '',
    amount: '',
    description: '',
    FSCCode: '',
    toAccount: selectedBeneficiary?.accountNumber || '',
    
    // Fields for within bank and NEFT transfers
    beneficiaryName: selectedBeneficiary?.name || '',
    
    // Fields specific to NEFT
    bankName: selectedBeneficiary?.bankName || '',
    
    // Fields specific to own account transfer
    transferType: 'immediate',
    
    // Fields specific to within bank
    remarks: '',
    
    // New fields for payment method selection
    paymentMethod: 'bank', // 'bank' or 'mno'
    mnoProvider: ''
  });
  
  const [errors, setErrors] = useState({});
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '' });
  const [transferResult, setTransferResult] = useState(null); // 'success', 'failure', or null
  
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

  const cancelTransfer = (shouldNavigate = true) => {
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
      transferType: 'immediate',
      beneficiaryName: selectedBeneficiary?.name || '',
      bankName: selectedBeneficiary?.bankName || '',
      FSCCode: selectedBeneficiary?.FSCCode || '',
      remarks: '',
      paymentMethod: 'bank',
      mnoProvider: ''
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
    const mockToken = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setPaymentToken(mockToken);
    sessionStorage.setItem('paymentToken', mockToken);
    sessionStorage.setItem('tokenExpiry', (Date.now() + 100000).toString()); // 5 minutes from now
    setTimeRemaining(300);
    setTokenExpired(false);
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
    if(name === 'paymentMethod' ){
      cancelTransfer();
      setFromAccountDisabled(false);
      setToAccountDisabled(true);
      setOtherFieldsDisabled(true);
    }
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

    // Auto-fill bank name when FSC code is selected (for NEFT transfers)
    if (name === 'FSCCode' && paymentType === 'neft' && value) {
      const selectedBank = tanzanianBanks.find(bank => bank.fscCode === value);
      if (selectedBank) {
        setFormData(prevState => ({
          ...prevState,
          bankName: selectedBank.name
        }));
      }
    }
    
    // Reset related fields when payment method changes
    if (name === 'paymentMethod') {
      setFormData(prevState => ({
        ...prevState,
        FSCCode: '',
        bankName: '',
        mnoProvider: ''
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
                cancelTransfer(false); // Reset form without navigating away
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
        // Use the appropriate identifier type based on payment method
        const identifierType = formData.paymentMethod === 'mno' ? "MSISDN" : formData.paymentMethod === 'merchant' ? "Bussiness" : formData.paymentMethod === 'payByAlias' ? "Alias" : "BANK";
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
                setModalMessage(formData.paymentMethod === 'mno' 
                  ? "The mobile number you have entered is not active. Please enter another number."
                  : "The beneficiary account you have chosen is not active. Please choose another account.");
                setModalType("to");
                setShowModal(true);
                
                // Auto-close modal after 3 seconds
                setTimeout(() => {
                  setShowModal(false);
                  cancelTransfer(false); // Reset form without navigating away
                }, 3000);
              }, 1000);
            }
          })
          .catch(error => {
            console.error("Error looking up to account:", error);
            setErrors(prevState => ({
              ...prevState,
              toAccount: formData.paymentMethod === 'mno' 
                ? 'Error looking up mobile number' 
                : 'Error looking up account'
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
    
    // Common validations for all payment types
    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Please select a source account';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Please enter an amount';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = 'Insufficient funds in your account';
    }
    
    // Specific validations based on payment type
    if (paymentType === 'own') {
      // Own account transfer validations
      if (!formData.toAccount) {
        newErrors.toAccount = 'Please select a destination account';
      }
      
      if (formData.fromAccount && formData.toAccount && formData.fromAccount === formData.toAccount) {
        newErrors.toAccount = 'Source and destination accounts cannot be the same';
      }
      
      if (formData.description && formData.description.length > 50) {
        newErrors.description = 'Description cannot exceed 50 characters';
      }
    } else if (paymentType === 'within' || paymentType === 'neft') {
      // Common validations for within bank and NEFT transfers
      if (!formData.toAccount) {
        newErrors.toAccount = formData.paymentMethod === 'mno' 
          ? 'Please enter mobile number' 
          : 'Please enter beneficiary account number';
      } else if (!/^[0-9]{10}$/.test(formData.toAccount)) {
        newErrors.toAccount = formData.paymentMethod === 'mno'
          ? 'Mobile number should be 10 digits'
          : 'Account number should be 10 digits';
      }
      
      if (!formData.beneficiaryName) {
        newErrors.beneficiaryName = 'Please enter beneficiary name';
      } else if (formData.beneficiaryName.length < 3) {
        newErrors.beneficiaryName = 'Name should be at least 3 characters';
      }
      
      // Payment method specific validations
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = 'Please select a payment method';
      } else if (formData.paymentMethod === 'bank') {
        if (!formData.FSCCode) {
          newErrors.FSCCode = 'Please select a bank FSC code';
        }
      } else if (formData.paymentMethod === 'mno') {
        if (!formData.mnoProvider) {
          newErrors.mnoProvider = 'Please select a mobile money provider';
        }
      }
      
      // Additional validations for NEFT
      if (paymentType === 'neft') {
        if (formData.paymentMethod === 'bank' && !formData.bankName) {
          newErrors.bankName = 'Please enter bank name';
        }
        
        if (parseFloat(formData.amount) > 1000000) {
          newErrors.amount = 'Amount exceeds maximum NEFT transfer limit of TZS 10,00,000';
        }
      } else {
        // Within bank specific validations
        if (formData.remarks && formData.remarks.length > 50) {
          newErrors.remarks = 'Remarks cannot exceed 50 characters';
        }
        
        if (parseFloat(formData.amount) > 1000000) {
          newErrors.amount = 'Amount exceeds maximum transfer limit of TZS 10,00,000';
        }
      }
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

  const confirmTransfer = () => {
    scrollToTop();
    setLoading(true);
    const currentToken = sessionStorage.getItem('paymentToken');
    sendOtpRequest(formData.fromAccount, "BANK", "PAYMENT", "self")
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
        processTransfer();
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setLoading(false);
      }
    }, 2000);
  };

  const processTransfer = () => {
    setIsProcessing(true);
    setLoading(true);
    const currentToken = sessionStorage.getItem('paymentToken');
    
    // Send the payment request with token
    sendPaymentRequest(
      paymentType,
      {
        identifier: formData.fromAccount,
        type: 'BANK'
      },
      {
        identifier: formData.toAccount,
        type: formData.paymentMethod === 'mno' ? 'MSISDN' : 'BANK'
      },
      formData.amount,
    )
      .then(response => {
        console.log("Payment response:", response);
        setTransferResult('success');
        // Clear session after successful payment
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
    return `${account.number.slice(0, 4)}...${account.number.slice(-4)} (${account.type}) - TZS ${account.balance.toLocaleString()}`;
  };

  // Get selected account details
  const getSelectedAccount = (accountNumber) => {
    return userAccounts.find(acc => acc.number === accountNumber);
  };

  const fromAccount = getSelectedAccount(formData.fromAccount);
  const toAccount = getSelectedAccount(formData.toAccount);

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
          <h3>Verify OTP</h3>
          <p>We've sent a 6-digit OTP to your registered mobile number</p>
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
            <span>Resend OTP in {resendTimer}s</span>
          ) : (
            <button type="button" className="resend-btn" onClick={resendOTP}>
              Resend OTP
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
                Verifying...
              </>
            ) : (
              'Verify & Proceed'
            )}
          </button>
          <button
            type="button"
            className="otp-back-btn"
            onClick={() => setShowOTP(false)}
          >
            Back to Form
          </button>
        </div>
        
        <div className="otp-demo-hint">
          <small>Demo OTP: 123456</small>
        </div>
      </div>
    </div>
  );

  // Render the appropriate form based on payment type
  const renderPaymentForm = () => {
    const formClassName = `${paymentType}-form`;
    const errorClassName = `${paymentType}-error-input`;
    const errorMessageClassName = `${paymentType}-error-message`;
    
    return (
      <form className={formClassName} onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center">
        <h2 className={`${paymentType}-title`}>
          {paymentType === 'own' && 'Transfer Between Your Accounts'}
          {paymentType === 'within' && (formData.paymentMethod === 'bank' ? 'Bank to Bank Transfer' : formData.paymentMethod === 'mno' ? 'Mobile Money Transfer' : formData.paymentMethod === 'merchant' ? 'Merchant Payment' : 'Pay by Alias')}
          {paymentType === 'neft' && (formData.paymentMethod === 'bank' ? 'NEFT Bank Transfer' : 'NEFT Mobile Money Transfer')} 
        </h2>
        {renderSessionTimer()}
        </div>
        {paymentType === 'neft' && (
          <div className="neft-timing-info mb-3">
            <strong>NEFT Timings:</strong> NEFT transfers are processed in hourly batches from 8:00 AM to 7:00 PM on weekdays and 8:00 AM to 1:00 PM on Saturdays. Transfers may take 2-4 hours to complete.
          </div>
        )}
                  {/* Payment Method Selection - For Within Bank and NEFT */}
                  {(paymentType === 'within') && (
            <div className={`${paymentType}-form-row`}>
              <div className={`${paymentType}-form-group`}>
                <label className={`${paymentType}-form-label`}>Payment Method</label>
                <div className={`${paymentType}-radio-group payment-method-selection`}>
                  <div className={`${paymentType}-radio-option ${formData.paymentMethod === 'bank' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      id="bank-payment"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleChange}
                    />
                    <label htmlFor="bank-payment">Bank Payment</label>
                  </div>
                  <div className={`${paymentType}-radio-option ${formData.paymentMethod === 'mno' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      id="mno-payment"
                      name="paymentMethod"
                      value="mno"
                      checked={formData.paymentMethod === 'mno'}
                      onChange={handleChange}
                    />
                    <label htmlFor="mno-payment">Mobile Money (MNO)</label>
                  </div>
                  <div className={`${paymentType}-radio-option ${formData.paymentMethod === 'merchant' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      id="merchant-payment"
                      name="paymentMethod"
                      value="merchant"
                      checked={formData.paymentMethod === 'merchant'}
                      onChange={handleChange}
                    />
                    <label htmlFor="merchant-payment">Merchant Payment</label>
                  </div>
                  <div className={`${paymentType}-radio-option ${formData.paymentMethod === 'payByAlias' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      id="pay-by-Alias"
                      name="paymentMethod"
                      value="payByAlias"
                      checked={formData.paymentMethod === 'payByAlias'}
                      onChange={handleChange}
                    />
                    <label htmlFor="pay-by-Alias">Pay by Alias</label>
                  </div>
                </div>
                {errors.paymentMethod && <span className={errorMessageClassName}>{errors.paymentMethod}</span>}
              </div>
            </div>
          )}
        <div className={`${paymentType}-form-content`}>
          {/* From Account - Common for all payment types */}
          <div className={`${paymentType}-form-row`}>
            <div className={`${paymentType}-form-group`}>
              <label className={`${paymentType}-form-label`} htmlFor="fromAccount">From Account</label>
              <select
                className={`${paymentType}-form-select ${errors.fromAccount ? errorClassName : ''}`}
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
                <option value="">Select source account</option>
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
              
              {formData.fromAccount && (
                <div className={`${paymentType}-account-info`}>
                  <span className={`${paymentType}-account-balance`}>Available Balance: TZS {availableBalance.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* To Account - Only for Own Account Transfer */}
            {paymentType === 'own' && (
              <div className={`${paymentType}-form-group`}>
                <label className={`${paymentType}-form-label`} htmlFor="toAccount">To Account</label>
                <select
                  className={`${paymentType}-form-select ${errors.toAccount ? errorClassName : ''}`}
                  id="toAccount"
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={(e) => {
                    handleChange(e);
                    handleAccountSearch(e, 'to');
                  }}
                  maxLength={10}
                  required
                  disabled={toAccountDisabled}
                >
                  <option value="">Select destination account</option>
                  {userAccounts
                    .filter(account => 
                      account.number !== formData.fromAccount && (
                        !searchQuery.to || 
                        account.number.toLowerCase().includes(searchQuery.to.toLowerCase()) ||
                        account.type.toLowerCase().includes(searchQuery.to.toLowerCase())
                      )
                    )
                    .map(account => (
                      <option key={account.id} value={account.number}>
                        {formatAccountNumber(account)}
                      </option>
                    ))}
                </select>
                {errors.toAccount && <span className={errorMessageClassName}>{errors.toAccount}</span>}
              </div>
            )}

            {/* Beneficiary Account - For Within Bank and NEFT */}
            {(paymentType === 'within' || paymentType === 'neft') && (
              <div className={`${paymentType}-form-group`}>
                <label className={`${paymentType}-form-label`} htmlFor="toAccount">
                  {formData.paymentMethod === 'mno' ? 'Mobile Number' : formData.paymentMethod === 'merchant' ? 'Merchant Id' : formData.paymentMethod === 'payByAlias' ? 'Alias Id or Name' : 'Beneficiary Account Number'}
                </label>
                <input
                  type="text"
                  className={`${paymentType}-form-input ${errors.toAccount ? errorClassName : ''}`}
                  id="toAccount"
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  placeholder={formData.paymentMethod === 'mno' ? "Enter mobile number" : formData.paymentMethod === 'merchant' ? "Enter merchant id" : formData.paymentMethod === 'payByAlias' ? "Enter Alias id or name" : "Enter beneficiary account number"}
                  required
                  maxLength={10}
                  disabled={toAccountDisabled}
                />
                {errors.toAccount ? (
                  <span className={errorMessageClassName}>{errors.toAccount}</span>
                ) : (
                  <span className={`${paymentType}-form-helper`}>
                    {formData.paymentMethod === 'mno' 
                      ? 'Mobile number should be 10 digits' 
                      : formData.paymentMethod === 'merchant' 
                      ? 'Merchant id should be 10 digits' 
                      : formData.paymentMethod === 'payByAlias' 
                      ? 'Alias id or name should be 10 digits' 
                      : 'Account number should be 10 digits'}
                  </span>
                )}
              </div>
            )}
          </div>



          {/* Beneficiary Name and Bank/FSC - For Within Bank and NEFT */}
          {(paymentType === 'within' || paymentType === 'neft') && (
            <div className={`${paymentType}-form-row`}>
              <div className={`${paymentType}-form-group`}>
                <label className={`${paymentType}-form-label`} htmlFor="beneficiaryName">Beneficiary Name</label>
                <input
                  type="text"
                  className={`${paymentType}-form-input ${errors.beneficiaryName ? errorClassName : ''}`}
                  id="beneficiaryName"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  placeholder="Enter beneficiary name"
                  required
                  disabled={otherFieldsDisabled}
                />
                {errors.beneficiaryName && <span className={errorMessageClassName}>{errors.beneficiaryName}</span>}
              </div>

              {/* Bank-specific fields */}
              {formData.paymentMethod === 'bank' && (
                <>
                  {paymentType === 'neft' && (
                    <div className={`${paymentType}-form-group`}>
                      <label className={`${paymentType}-form-label`} htmlFor="bankName">Bank Name</label>
                      <input
                        type="text"
                        className={`${paymentType}-form-input ${errors.bankName ? errorClassName : ''}`}
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="Enter bank name"
                        required
                        disabled={formData.FSCCode !== '' || otherFieldsDisabled}
                      />
                      {errors.bankName && <span className={errorMessageClassName}>{errors.bankName}</span>}
                      {formData.FSCCode && (
                        <span className={`${paymentType}-form-helper`}>Bank name auto-filled from selected bank</span>
                      )}
                    </div>
                  )}

                  <div className={`${paymentType}-form-group`}>
                    <label className={`${paymentType}-form-label`} htmlFor="FSCCode">Bank & FSC Code</label>
                    <select
                      className={`${paymentType}-form-select ${errors.FSCCode ? errorClassName : ''}`}
                      id="FSCCode"
                      name="FSCCode"
                      value={formData.FSCCode}
                      onChange={handleChange}
                      required
                      disabled={otherFieldsDisabled}
                    >
                      <option value="">Select bank</option>
                      {tanzanianBanks.map((bank, index) => (
                        <option key={index} value={bank.fscCode}>
                          {bank.name} ({bank.fscCode})
                        </option>
                      ))}
                    </select>
                    {errors.FSCCode && <span className={errorMessageClassName}>{errors.FSCCode}</span>}
                  </div>
                </>
              )}

              {/* MNO-specific fields */}
              {formData.paymentMethod === 'mno' && (
                <div className={`${paymentType}-form-group`}>
                  <label className={`${paymentType}-form-label`} htmlFor="mnoProvider">Mobile Money Provider</label>
                  <select
                    className={`${paymentType}-form-select ${errors.mnoProvider ? errorClassName : ''}`}
                    id="mnoProvider"
                    name="mnoProvider"
                    value={formData.mnoProvider}
                    onChange={handleChange}
                    required
                    disabled={otherFieldsDisabled}
                  >
                    <option value="">Select provider</option>
                    {mnoProviders.map((provider, index) => (
                      <option key={index} value={provider.code}>
                        {provider.name} ({provider.code})
                      </option>
                    ))}
                  </select>
                  {errors.mnoProvider && <span className={errorMessageClassName}>{errors.mnoProvider}</span>}
                </div>
              )}
            </div>
          )}

          {/* Amount and Description/Remarks - Common for all with slight variations */}
          <div className={`${paymentType}-form-row`}>
            <div className={`${paymentType}-form-group`}>
              <label className={`${paymentType}-form-label`} htmlFor="amount">Amount</label>
              <div className={`${paymentType}-amount-input-wrapper`}>
                <span className={`${paymentType}-currency-symbol`}>TZS </span>
                <input
                  type="number"
                  className={`${paymentType}-form-input ${errors.amount ? errorClassName : ''}`}
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
                <span className={`${paymentType}-form-helper`}>
                  {paymentType === 'own' ? 'Minimum transfer amount: TZS 1' : 'Maximum transfer limit: TZS 10,00,000'}
                </span>
              )}
            </div>

            <div className={`${paymentType}-form-group`}>
              <label className={`${paymentType}-form-label`} htmlFor={paymentType === 'within' ? 'remarks' : 'description'}>
                {paymentType === 'within' ? 'Remarks (Optional)' : 'Description (Optional)'}
              </label>
              <input
                type="text"
                className={`${paymentType}-form-input ${errors[paymentType === 'within' ? 'remarks' : 'description'] ? errorClassName : ''}`}
                id={paymentType === 'within' ? 'remarks' : 'description'}
                name={paymentType === 'within' ? 'remarks' : 'description'}
                value={formData[paymentType === 'within' ? 'remarks' : 'description']}
                onChange={handleChange}
                placeholder="e.g., Rent payment, Gift"
                maxLength={50}
                disabled={otherFieldsDisabled}
              />
              <span className={`${paymentType}-form-helper`}>
                {formData[paymentType === 'within' ? 'remarks' : 'description'].length}/50 characters
              </span>
              {errors[paymentType === 'within' ? 'remarks' : 'description'] && 
                <span className={errorMessageClassName}>{errors[paymentType === 'within' ? 'remarks' : 'description']}</span>}
            </div>
          </div>
          
          {/* Transfer Type - Only for Own Account Transfer */}
          {paymentType === 'own' && (
            <div className={`${paymentType}-form-group`}>
              <label className={`${paymentType}-form-label`}>Transfer Type</label>
              <div className={`${paymentType}-radio-group`}>
                <div className={`${paymentType}-radio-option`}>
                  <input
                    type="radio"
                    id="immediate"
                    name="transferType"
                    value="immediate"
                    checked={formData.transferType === 'immediate'}
                    onChange={handleChange}
                    disabled={otherFieldsDisabled}
                  />
                  <label htmlFor="immediate">Immediate Transfer</label>
                </div>
                <div className={`${paymentType}-radio-option`}>
                  <input
                    type="radio"
                    id="scheduled"
                    name="transferType"
                    value="scheduled"
                    checked={formData.transferType === 'scheduled'}
                    onChange={handleChange}
                    disabled={otherFieldsDisabled}
                  />
                  <label htmlFor="scheduled">Scheduled Transfer</label>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Button Actions */}
        <div className={`${paymentType}-form-actions`}>
          <button 
            type="button" 
            className={`${paymentType}-btn ${paymentType}-btn-secondary`}
            onClick={back}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={`${paymentType}-btn ${paymentType}-btn-primary`}
            disabled={isProcessing || loading || otherFieldsDisabled}
          >
            {isProcessing ? 'Processing...' : 'Continue'}
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
    
    // Get the MNO provider name
    const selectedMNO = mnoProviders.find(provider => provider.code === formData.mnoProvider);
    const mnoName = selectedMNO ? selectedMNO.name : '';
    
    return (
      <div className="neft-confirmation">
        <div className="d-flex justify-content-between align-items-center">
        <h2 className="neft-title">
          {paymentType === 'own' && 'Confirm Own Account Transfer'}
          {paymentType === 'within' && (formData.paymentMethod === 'bank' 
            ? 'Confirm Bank to Bank Transfer' 
            : formData.paymentMethod === 'mno' ? 'Confirm Mobile Money Transfer' : formData.paymentMethod === 'merchant' ? 'Confirm Merchant Payment' : 'Confirm Pay by Alias' )}
          {paymentType === 'neft' && (formData.paymentMethod === 'bank'
            ? 'Confirm NEFT Bank Transfer'
            : 'Confirm NEFT Mobile Money Transfer')}
        </h2>
        {renderSessionTimer()}
        </div>
        <div className="neft-confirmation-details">
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">From Account:</span>
            <span className="neft-confirmation-value">
              {fromAccount ? `${fromAccount.number} (${fromAccount.type})` : ''}
            </span>
          </div>
          
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">
              {paymentType === 'own' 
                ? 'To Account:' 
                : (formData.paymentMethod === 'mno' ? 'Mobile Number:' : 'Beneficiary Account:')}
            </span>
            <span className="neft-confirmation-value">
              {paymentType === 'own' 
                ? (toAccount ? `${toAccount.number} (${toAccount.type})` : '')
                : formData.toAccount}
            </span>
          </div>
          
          {(paymentType === 'within' || paymentType === 'neft') && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">Beneficiary Name:</span>
              <span className="neft-confirmation-value">{formData.beneficiaryName}</span>
            </div>
          )}
          
          {(paymentType === 'within' || paymentType === 'neft') && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">Payment Method:</span>
              <span className="neft-confirmation-value">
                {formData.paymentMethod === 'bank' ? 'Bank Payment' : formData.paymentMethod === 'mno' ? 'Mobile Money (MNO)' : formData.paymentMethod === 'merchant' ? 'Merchant Payment' : 'Pay by Alias'}
              </span>
            </div>
          )}
          
          {formData.paymentMethod === 'bank' && paymentType === 'neft' && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">Bank Name:</span>
              <span className="neft-confirmation-value">{formData.bankName}</span>
            </div>
          )}
          
          {formData.paymentMethod === 'bank' && (paymentType === 'within' || paymentType === 'neft') && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">Bank & FSC Code:</span>
              <span className="neft-confirmation-value">
                {bankName} - {selectedBank ? selectedBank.code : ''} ({formData.FSCCode})
              </span>
            </div>
          )}
          
          {formData.paymentMethod === 'mno' && (paymentType === 'within' || paymentType === 'neft') && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">Mobile Money Provider:</span>
              <span className="neft-confirmation-value">{mnoName}</span>
            </div>
          )}
          
          <div className="neft-confirmation-row">
            <span className="neft-confirmation-label">Amount:</span>
            <span className="neft-confirmation-value neft-amount">
              TZS {parseFloat(formData.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </div>
          
          {formData[paymentType === 'within' ? 'remarks' : 'description'] && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">
                {paymentType === 'within' ? 'Remarks:' : 'Description:'}
              </span>
              <span className="neft-confirmation-value">
                {formData[paymentType === 'within' ? 'remarks' : 'description']}
              </span>
            </div>
          )}
          
          {paymentType === 'own' && (
            <div className="neft-confirmation-row">
              <span className="neft-confirmation-label">Transfer Type:</span>
              <span className="neft-confirmation-value">
                {formData.transferType === 'immediate' ? 'Immediate Transfer' : 'Scheduled Transfer'}
              </span>
            </div>
          )}
        </div>
        
        {/* NEFT timing info */}
        {paymentType === 'neft' && formData.paymentMethod === 'bank' && (
          <div className="neft-timing-info">
            <strong>Note:</strong> NEFT transfers are processed in hourly batches. The beneficiary may receive the funds within 2-4 hours depending on the bank's processing time.
          </div>
        )}
        
        <div className="neft-confirmation-actions">
          <button 
            className="own-btn own-btn-secondary"
            onClick={back}
            disabled={isProcessing || loading}
          >
            Cancel
          </button>
          <button 
            className="own-btn own-btn-primary"
            onClick={confirmTransfer}
            disabled={isProcessing || loading}
          >
            {isProcessing ? (
              <span className="neft-processing">
                <span className="neft-spinner"></span>
                Processing...
              </span>
            ) : 'Confirm Transfer'}
          </button>
        </div>
      </div>
    );
  };

  // Handle going back to transfer services
  const handleBackToServices = () => {
    scrollToTop();
    // Reset form
    setFormData({
      fromAccount: '',
      toAccount: '',
      amount: '',
      description: '',
      transferType: 'immediate',
      beneficiaryName: '',
      bankName: '',
      FSCCode: '038',
      remarks: '',
      paymentMethod: 'bank',
      mnoProvider: ''
    });
    setSearchQuery({ from: '', to: '' });
    setTransferResult(null);
    
    // Just go back to transfer options without showing a message
    onTransferComplete('success', '');
  };
  
  // Handle retry after failure
  const handleRetry = () => {
    setTransferResult(null);
    setShowConfirmation(true);
  };
  
  // Prepare transfer details for success/failure pages
  const getTransferDetails = () => {
    const fromAccount = getSelectedAccount(formData.fromAccount);
    const toAccountDetails = paymentType === 'own' ? getSelectedAccount(formData.toAccount) : null;
    
    return {
      fromAccount: fromAccount ? `${fromAccount.number} (${fromAccount.type})` : '',
      toAccount: paymentType === 'own' 
        ? (toAccountDetails ? `${toAccountDetails.number} (${toAccountDetails.type})` : '')
        : formData.toAccount,
      beneficiaryName: formData.beneficiaryName,
      bankName: formData.bankName,
      FSCCode: formData.FSCCode,
      amount: formData.amount,
      description: formData[paymentType === 'within' ? 'remarks' : 'description'],
      transferType: formData.transferType === 'immediate' ? 'Immediate Transfer' : 'Scheduled Transfer',
      errorMessage: 'The transaction could not be completed due to a temporary system issue. Please try again.'  // Mock error message
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
              cancelTransfer(false); // Reset form without navigating away
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
        {/* Session Timer */}
        
        {transferResult === 'success' ? (
          <TransferSuccess 
            paymentType={paymentType} 
            transferDetails={getTransferDetails()} 
            onStartNew={handleBackToServices} 
          />
        ) : transferResult === 'failure' ? (
          <TransferFailure 
            paymentType={paymentType} 
            transferDetails={getTransferDetails()} 
            onRetry={handleRetry}
            onStartNew={handleBackToServices} 
          />
        ) : (
          <>
            {showConfirmation ? renderConfirmation() : renderPaymentForm()}
            {showOTP && renderOTPModule()}
          </>
        )}
      </div>
    </>
  );
};

export default OverAllPaymentsPage;