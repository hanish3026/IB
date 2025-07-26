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

const InternationalTransfer = ({ onTransferComplete, setSelectedModule }) => {
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
    swiftCode: '',
    ibanNumber: '',
    bankCode: '',
    bankName: '',
    branchName: '',
    creditAmount: '',
    debitAmount: '',
    purposeCode: '',
    description: '',
    chargesBy: '',
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

  // Purpose codes for international transfer
  const purposeCodes = [
    { code: 'INT001', description: t('internationalTransfer') },
    { code: 'FAM002', description: t('familySupport') },
    { code: 'BUS002', description: t('businessPayment') },
    { code: 'SAL002', description: t('salaryPayment') },
    { code: 'EDU001', description: t('educationFees') },
    { code: 'MED001', description: t('medicalTreatment') },
    { code: 'INV002', description: t('investment') },
    { code: 'TRA001', description: t('travelExpenses') },
    { code: 'REM001', description: t('remittance') },
    { code: 'OTH002', description: t('otherPurpose') }
  ];

  // Charges by options
  const chargesOptions = [
    { code: 'OUR', description: 'OUR - All charges borne by sender' },
    { code: 'BEN', description: 'BEN - All charges borne by beneficiary' },
    { code: 'SHA', description: 'SHA - Charges shared between sender and beneficiary' }
  ];

  // Mock data for user accounts (same as DomesticTransfer)
  const userAccounts = [
    { id: '1', number: '1234567890', type: 'Savings', balance: 50000, currency: 'TZS' },
    { id: '2', number: '9876543210', type: 'Current', balance: 100000, currency: 'TZS' },
    { id: '3', number: '5555666677', type: 'Salary', balance: 75000, currency: 'TZS' }
  ];

  // International banks with SWIFT codes
  const internationalBanks = [
    { code: 'CHAS', name: 'JPMorgan Chase Bank', country: 'USA', swift: 'CHASUS33' },
    { code: 'BOA', name: 'Bank of America', country: 'USA', swift: 'BOFAUS3N' },
    { code: 'CITI', name: 'Citibank', country: 'USA', swift: 'CITIUS33' },
    { code: 'WELLS', name: 'Wells Fargo Bank', country: 'USA', swift: 'WFBIUS6S' },
    { code: 'HSBC', name: 'HSBC Bank', country: 'UK', swift: 'HBUKGB4B' },
    { code: 'BARCLAYS', name: 'Barclays Bank', country: 'UK', swift: 'BARCGB22' },
    { code: 'LLOYDS', name: 'Lloyds Bank', country: 'UK', swift: 'LOYDGB2L' },
    { code: 'DEUTSCHE', name: 'Deutsche Bank', country: 'Germany', swift: 'DEUTDEFF' },
    { code: 'BNP', name: 'BNP Paribas', country: 'France', swift: 'BNPAFRPP' },
    { code: 'UBS', name: 'UBS Switzerland', country: 'Switzerland', swift: 'UBSWCHZH' }
  ];

  // Dummy international beneficiaries data
  const dummyInternationalBeneficiaries = [
    {
      id: 1,
      name: 'John Smith',
      accountNumber: 'USD123456789',
      ibanNumber: 'US64SVBKUS6S3300958879',
      swiftCode: 'CHASUS33',
      bankCode: 'CHAS',
      bankName: 'JPMorgan Chase Bank',
      branchName: 'New York Branch',
      country: 'USA'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      accountNumber: 'GBP987654321',
      ibanNumber: 'GB29NWBK60161331926819',
      swiftCode: 'HBUKGB4B',
      bankCode: 'HSBC',
      bankName: 'HSBC Bank',
      branchName: 'London Branch',
      country: 'UK'
    },
    {
      id: 3,
      name: 'Maria Garcia',
      accountNumber: 'EUR555666777',
      ibanNumber: 'ES9121000418450200051332',
      swiftCode: 'BNPAFRPP',
      bankCode: 'BNP',
      bankName: 'BNP Paribas',
      branchName: 'Paris Branch',
      country: 'France'
    },
    {
      id: 4,
      name: 'Hans Mueller',
      accountNumber: 'EUR888999000',
      ibanNumber: 'DE89370400440532013000',
      swiftCode: 'DEUTDEFF',
      bankCode: 'DEUTSCHE',
      bankName: 'Deutsche Bank',
      branchName: 'Berlin Branch',
      country: 'Germany'
    },
    {
      id: 5,
      name: 'David Chen',
      accountNumber: 'CHF777888999',
      ibanNumber: 'CH9300762011623852957',
      swiftCode: 'UBSWCHZH',
      bankCode: 'UBS',
      bankName: 'UBS Switzerland',
      branchName: 'Zurich Branch',
      country: 'Switzerland'
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
      swiftCode: '',
      ibanNumber: '',
      bankCode: '',
      bankName: '',
      branchName: '',
      creditAmount: '',
      debitAmount: '',
      purposeCode: '',
      description: '',
      chargesBy: '',
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
        setToAccountDisabled(true);
        setOtherFieldsDisabled(false);
      }
    }

    // Auto-fill bank name when bank code is selected
    if (name === 'bankCode') {
      const selectedBank = internationalBanks.find(bank => bank.code === value);
      if (selectedBank) {
        setFormData(prevState => ({
          ...prevState,
          bankName: selectedBank.name,
          swiftCode: selectedBank.swift
        }));
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
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Please select a source account';
    }
    
    if (!formData.toAccount) {
      newErrors.toAccount = 'Please select a beneficiary';
    }
    
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = 'Please enter beneficiary name';
    }
    
    if (!formData.swiftCode) {
      newErrors.swiftCode = 'Please enter SWIFT code';
    } else if (formData.swiftCode.length < 8 || formData.swiftCode.length > 11) {
      newErrors.swiftCode = 'SWIFT code must be 8-11 characters';
    }
    
    if (!formData.ibanNumber) {
      newErrors.ibanNumber = 'Please enter IBAN number';
    } else if (formData.ibanNumber.length < 15 || formData.ibanNumber.length > 34) {
      newErrors.ibanNumber = 'Invalid IBAN number format';
    }
    
    if (!formData.bankCode) {
      newErrors.bankCode = 'Please select a bank code';
    }
    
    if (!formData.bankName) {
      newErrors.bankName = 'Please enter bank name';
    }
    
    if (!formData.branchName) {
      newErrors.branchName = 'Please enter branch name';
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
    
    if (!formData.chargesBy) {
      newErrors.chargesBy = 'Please select charges option';
    }
    
    if (formData.description && formData.description.length > 50) {
      newErrors.description = 'Description cannot exceed 50 characters';
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
      'international',
      {
        identifier: formData.fromAccount,
        type: 'BANK'
      },
      {
        identifier: formData.toAccount,
        type: 'INTERNATIONAL',
        swiftCode: formData.swiftCode,
        iban: formData.ibanNumber,
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
      swiftCode: formData.swiftCode,
      ibanNumber: formData.ibanNumber,
      bankCode: formData.bankCode,
      bankName: formData.bankName,
      branchName: formData.branchName,
      creditAmount: formData.creditAmount,
      debitAmount: formData.debitAmount,
      purposeCode: formData.purposeCode,
      description: formData.description,
      chargesBy: formData.chargesBy,
      transferType: formData.transferType
    };
  };

  // Handle schedule transfer
  const handleScheduleTransfer = () => {
    setSelectedModule({type: 'schedule', transferType: 'international', data: formData});

  };

  // Render the form
  const renderPaymentForm = () => {
    return (
      <form className="own-form" onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="own-title">{t('internationalTransfer')}</h2>
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
              <label className="own-form-label" htmlFor="toAccount">{t('toAccountInternationalBeneficiary')}</label>
              <div className="to-account-container">
                <select
                  className={`own-form-select ${errors.toAccount ? 'own-error-input' : ''}`}
                  id="toAccount"
                  name="toAccount"
                  value={formData.toAccount ? dummyInternationalBeneficiaries.find(ben => ben.accountNumber === formData.toAccount)?.id || '' : ''}
                  onChange={handleChange}
                  required
                  disabled={toAccountDisabled}
                >
                  <option value="">{t('selectInternationalBeneficiary')}</option>
                  {dummyInternationalBeneficiaries.map(beneficiary => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.name} - {beneficiary.accountNumber} ({beneficiary.country})
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

          {/* Beneficiary Name and SWIFT Code */}
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
                disabled={otherFieldsDisabled}
              />
              {errors.beneficiaryName && <span className="own-error-message">{errors.beneficiaryName}</span>}
            </div>

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
                disabled={otherFieldsDisabled}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.swiftCode && <span className="own-error-message">{errors.swiftCode}</span>}
            </div>
          </div>

          {/* IBAN Number */}
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
                disabled={otherFieldsDisabled}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.ibanNumber && <span className="own-error-message">{errors.ibanNumber}</span>}
            </div>
          </div>

          {/* Bank Code and Bank Name */}
          <div className="own-form-row">
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
                <option value="">{t('selectBankCode')}</option>
                {internationalBanks.map((bank, index) => (
                  <option key={index} value={bank.code}>
                    {bank.code} - {bank.name} ({bank.country})
                  </option>
                ))}
              </select>
              {errors.bankCode && <span className="own-error-message">{errors.bankCode}</span>}
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
                disabled={otherFieldsDisabled}
              />
              {errors.bankName && <span className="own-error-message">{errors.bankName}</span>}
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
                placeholder={t('enterBranchName')}
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
                <span className="own-currency-symbol">USD </span>
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

          {/* Purpose Code and Charges By */}
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
              <label className="own-form-label" htmlFor="chargesBy">{t('chargesBy')}</label>
              <select
                className={`own-form-select ${errors.chargesBy ? 'own-error-input' : ''}`}
                id="chargesBy"
                name="chargesBy"
                value={formData.chargesBy}
                onChange={handleChange}
                required
                disabled={otherFieldsDisabled}
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
          </div>

          {/* Description */}
          <div className="own-form-row">
            <div className="own-form-group">
              <label className="own-form-label" htmlFor="description">{t('description')} ({t('optional')})</label>
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
      swiftCode: '',
      ibanNumber: '',
      bankCode: '',
      bankName: '',
      branchName: '',
      creditAmount: '',
      debitAmount: '',
      purposeCode: '',
      description: '',
      chargesBy: '',
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
    const selectedCharges = chargesOptions.find(c => c.code === formData.chargesBy);
    
    return {
      fromAccount: fromAccount ? `${fromAccount.number} (${fromAccount.type})` : '',
      toAccount: `${formData.toAccount} (${formData.beneficiaryName})`,
      bankName: formData.bankName,
      branchName: formData.branchName,
      swiftCode: formData.swiftCode,
      ibanNumber: formData.ibanNumber,
      amount: formData.creditAmount || formData.debitAmount,
      purposeCode: selectedPurpose ? `${selectedPurpose.code} - ${selectedPurpose.description}` : formData.purposeCode,
      chargesBy: selectedCharges ? selectedCharges.description : formData.chargesBy,
      description: formData.description,
      transferType: formData.transferType === 'immediate' ? 'Immediate Transfer' : 'Scheduled Transfer',
      errorMessage: 'The international transfer could not be completed due to a temporary system issue. Please try again.'
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
            paymentType="international" 
            transferDetails={getTransferDetails()} 
            onStartNew={handleBackToServices} 
          />
        ) : transferResult === 'failure' ? (
          <TransferFailure 
            paymentType="international" 
            transferDetails={getTransferDetails()} 
            onRetry={handleRetry}
            onStartNew={handleBackToServices} 
          />
        ) : showConfirmation ? (
          <TransferConfirmation
            transferData={getTransferDataForConfirmation()}
            paymentType="international"
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

export default InternationalTransfer;