import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSave, FaInfoCircle, FaSpinner, FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';
import useScrollToTop from '../../../hooks/useScrollToTop';
import "../css/BillPayForm.css";
const BillPayForm = ({ category, provider, onSubmit, onBack }) => {
  // Scroll to top hook
  const scrollToTop = useScrollToTop();
  
  // Form flow states
  const [currentStep, setCurrentStep] = useState(1);
  const [accountVerified, setAccountVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  
  // Form data state - modular structure for easy field addition
  const [formData, setFormData] = useState({
    // Account Information
    accountNumber: '',
    
    // Payment Information
    amount: '',
    selectedPlan: null,
    
    // Customer Information
    name: '',
    email: '',
    phone: '',
    
    // Additional Information
    saveForLater: false,
    nickname: '',
    
    // Future extensible fields container
    customFields: {},
    metadata: {}
  });
  
  // Auto-fill and verification states
  const [customerDetails, setCustomerDetails] = useState(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [plans, setPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  
  // OTP States
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  
  // Form validation and processing states
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Comprehensive dummy data structure - easily replaceable with API calls
  const accountDatabase = {
    electricity: {
      '12345': { 
        name: 'Hanish', 
        amount: '5000', 
        email: 'john@example.com', 
        phone: '1234567890',
        billNumber: 'ELEC-001-2024',
        dueDate: '2024-12-31',
        accountType: 'Residential'
      },
      '67890': { 
        name: 'Jane Smith', 
        amount: '7500', 
        email: 'jane@example.com', 
        phone: '9876543210',
        billNumber: 'ELEC-002-2024',
        dueDate: '2024-12-28',
        accountType: 'Commercial'
      },
      '123': { 
        name: 'Test User', 
        amount: '3000', 
        email: 'test@example.com', 
        phone: '9999999999',
        billNumber: 'ELEC-TEST-2024',
        dueDate: '2024-12-25',
        accountType: 'Residential'
      }
    },
    internet: {
      'INT123': { 
        name: 'Alex Johnson', 
        amount: '12000', 
        email: 'alex@example.com', 
        phone: '5556667777',
        planType: 'Fiber 100Mbps',
        billNumber: 'INT-001-2024',
        connectionType: 'Fiber'
      },
      'INT456': { 
        name: 'Sarah Williams', 
        amount: '8000', 
        email: 'sarah@example.com', 
        phone: '3334445555',
        planType: 'ADSL 20Mbps',
        billNumber: 'INT-002-2024',
        connectionType: 'DSL'
      }
    },
    mobile: {
      '1234567890': {
        name: 'Mobile User One',
        email: 'mobile1@example.com',
        phone: '1234567890',
        currentPlan: 'Monthly Bundle',
        accountStatus: 'Active',
        lastRecharge: '2024-11-15',
        balance: '2500'
      },
      '9876543210': {
        name: 'Mobile User Two',
        email: 'mobile2@example.com',
        phone: '9876543210',
        currentPlan: 'Weekly Bundle',
        accountStatus: 'Active',
        lastRecharge: '2024-11-20',
        balance: '1200'
      },
      '5555555555': {
        name: 'Demo Mobile User',
        email: 'demo@example.com',
        phone: '5555555555',
        currentPlan: 'Daily Bundle',
        accountStatus: 'Active',
        lastRecharge: '2024-11-22',
        balance: '500'
      }
    },
    tv: {
      'TV12345': {
        name: 'TV Subscriber One',
        email: 'tv1@example.com',
        phone: '1111222233',
        currentPackage: 'Premium Package',
        smartCardStatus: 'Active',
        expiryDate: '2024-12-31',
        accountBalance: '5000'
      },
      'TV67890': {
        name: 'TV Subscriber Two',
        email: 'tv2@example.com',
        phone: '4444555566',
        currentPackage: 'Basic Package',
        smartCardStatus: 'Active',
        expiryDate: '2024-12-25',
        accountBalance: '2000'
      }
    },
    goverment: {
      'GOV001': { 
        name: 'Michael Brown', 
        amount: '3000', 
        email: 'michael@example.com', 
        phone: '1112223333',
        serviceType: 'License Renewal',
        referenceNumber: 'GOV-LIC-001'
      }
    }
  };

  // Plan configurations for different services
  const planConfigurations = {
    mobile: [
      { 
        id: 1, 
        name: 'Daily Bundle', 
        amount: 1000, 
        validity: '24 Hours', 
        data: '100MB',
        sms: '10 SMS',
        description: 'Perfect for daily usage'
      },
      { 
        id: 2, 
        name: 'Weekly Bundle', 
        amount: 5000, 
        validity: '7 Days', 
        data: '1GB',
        sms: '50 SMS',
        description: 'Great for weekly usage'
      },
      { 
        id: 3, 
        name: 'Monthly Bundle', 
        amount: 15000, 
        validity: '30 Days', 
        data: '5GB',
        sms: '200 SMS',
        description: 'Best value for monthly usage'
      }
    ],
    tv: [
      { 
        id: 1, 
        name: 'Basic Package', 
        amount: 10000, 
        channels: '50+ Channels', 
        validity: '30 Days',
        description: 'Essential entertainment package'
      },
      { 
        id: 2, 
        name: 'Standard Package', 
        amount: 25000, 
        channels: '100+ Channels', 
        validity: '30 Days',
        description: 'Popular choice with sports'
      },
      { 
        id: 3, 
        name: 'Premium Package', 
        amount: 45000, 
        channels: '200+ Channels', 
        validity: '30 Days',
        description: 'Complete entertainment experience'
      }
    ]
  };

  // Form field configuration for easy addition of new fields
  const getFormFields = () => {
    const baseFields = [
      {
        name: 'name',
        label: 'Customer Name',
        type: 'text',
        placeholder: 'Enter customer name',
        required: true,
        canAutoFill: true
      },
      {
        name: 'email',
        label: 'Email for Receipt (Optional)',
        type: 'email',
        placeholder: 'your@email.com',
        required: false,
        canAutoFill: true,
        validation: (value) => !value || /\S+@\S+\.\S+/.test(value)
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Your phone number',
        required: true,
        canAutoFill: true,
        validation: (value) => /^\d{10}$/.test(value)
      }
    ];

    // Add category-specific fields
    if (category.id === 'mobile') {
      return baseFields;
    } else if (category.id === 'tv') {
      return baseFields;
    } else {
      return baseFields;
    }
  };

  // Initialize plans based on category
  useEffect(() => {
    if (['mobile', 'tv'].includes(category.id) && planConfigurations[category.id]) {
      setPlans(planConfigurations[category.id]);
    }
  }, [category.id]);

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

  // Generic form field handler - makes adding new fields easy
  const updateFormData = (fieldName, value, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
    
    // Clear field error
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Prevent editing auto-filled fields when locked
    if (isAutoFilled && ['name', 'email', 'phone'].includes(name)) {
      return;
    }
    
    const fieldValue = type === 'checkbox' ? checked : value;
    updateFormData(name, fieldValue);
  };

  // Plan selection handler
  const selectPlan = (plan) => {
    // scrollToTop();
    updateFormData('selectedPlan', plan);
    updateFormData('amount', plan.amount.toString());
  };

  // Validation functions
  const validateField = (fieldName, value, fieldConfig) => {
    if (fieldConfig.required && !value) {
      return `${fieldConfig.label} is required`;
    }
    
    if (value && fieldConfig.validation && !fieldConfig.validation(value)) {
      if (fieldName === 'email') return 'Please enter a valid email address';
      if (fieldName === 'phone') return 'Please enter a valid 10-digit phone number';
      return `Invalid ${fieldConfig.label.toLowerCase()}`;
    }
    
    return null;
  };

  const validateAccountNumber = () => {
    const newErrors = {};
    
    if (!formData.accountNumber) {
      newErrors.accountNumber = `${provider.accountLabel || 'Account number'} is required`;
    } else if (formData.accountNumber.length < 3) {
      newErrors.accountNumber = `${provider.accountLabel || 'Account number'} must be at least 3 characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = getFormFields();
    
    // Validate amount
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    // Validate form fields
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name], field);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    // Validate nickname if saving
    if (formData.saveForLater && !formData.nickname) {
      newErrors.nickname = 'Please provide a nickname for this bill';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Account verification function
  const verifyAccount = () => {
    if (validateAccountNumber()) {
      setVerifying(true);
      // Scroll to top when verification starts
      scrollToTop();
      // Simulate API call
      setTimeout(() => {
        setVerifying(false);
        
        const accountDetails = accountDatabase[category.id]?.[formData.accountNumber];
        
        if (accountDetails) {
          // Account found - auto-fill details
          setAccountVerified(true);
          setIsAutoFilled(true);
          setCustomerDetails(accountDetails);
          
          // Auto-fill form data
          setFormData(prev => ({
            ...prev,
            name: accountDetails.name || '',
            email: accountDetails.email || '',
            phone: accountDetails.phone || '',
            amount: accountDetails.amount || prev.amount
          }));
          
          // Show plans for mobile/tv or move to step 2 for others
          if (['mobile', 'tv'].includes(category.id)) {
            setShowPlans(true);
          } else {
            setCurrentStep(2);
          }
        } else {
          // For mobile/tv, validate format and show plans
          if (['mobile', 'tv'].includes(category.id)) {
            const isValidFormat = (category.id === 'mobile' && /^\d{10}$/.test(formData.accountNumber)) || 
                                 (category.id === 'tv' && formData.accountNumber.length >= 5);
            
            if (isValidFormat) {
              setAccountVerified(true);
              setShowPlans(true);
              setErrors({});
            } else {
              setErrors({
                accountNumber: `Please enter a valid ${category.id === 'mobile' ? 'mobile number' : 'smart card number'}`
              });
            }
          } else {
            setErrors({
              accountNumber: 'Account not found. Please check your account number.'
            });
          }
        }
      }, 1500);
    }
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

  const verifyOTP = () => {
    scrollToTop();
    const otp = otpValue.join('');
    if (otp.length !== 6) {
      setOtpError('Please enter complete OTP');
      return;
    }
    
    setVerifyingOTP(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setVerifyingOTP(false);
      if (otp === '123456') { // Demo OTP
        processPayment();
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    }, 2000);
  };

  const resendOTP = () => {
    scrollToTop();
    setCanResend(false);
    setResendTimer(30);
    setOtpValue(['', '', '', '', '', '']);
    setOtpError('');
    console.log('OTP resent to:', formData.phone);
  };

  const processPayment = () => {
    scrollToTop();
    setIsProcessing(true);
    
    // Prepare final payment data
    const paymentData = {
      ...formData,
      categoryId: category.id,
      providerId: provider.id,
      customerDetails,
      timestamp: new Date().toISOString()
    };
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSubmit(paymentData);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    scrollToTop();
    
    if (validateForm()) {
      // Show OTP module
      setShowOTP(true);
      setResendTimer(30);
      setCanResend(false);
      console.log('OTP sent to:', formData.phone);
    }
  };

  // Quick amount options
  const quickAmounts = [50, 100, 200, 500, 1000];

  // Render OTP Module
  const renderOTPModule = () => (
    <div className="otp-overlay">
      <div className="otp-container">
        <div className="otp-header">
          <FaShieldAlt className="otp-icon" />
          <h3>Verify OTP</h3>
          <p>We've sent a 6-digit OTP to your mobile number</p>
          <strong>{formData.phone}</strong>
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
                <FaSpinner className="spinner" />
                Verifying...
              </>
            ) : (
              'Verify & Pay'
            )}
          </button>
                      <button
            type="button"
            className="otp-back-btn"
            onClick={() => {
              scrollToTop();
              setShowOTP(false);
            }}
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

  // Render Step 1: Account Verification
  const renderStep1 = () => (
    <div className="form-step">
      <div className="form-group">
        <label htmlFor="accountNumber">
          {provider.accountLabel || 'Account/Consumer Number'}
        </label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className={errors.accountNumber ? 'error' : ''}
          placeholder={provider.accountHint || "Enter your account number"}
        />
        {errors.accountNumber && (
          <div className="error-message">{errors.accountNumber}</div>
        )}
        {provider.accountHint && (
          <div className="input-hint">
            <FaInfoCircle /> {provider.accountHint}
          </div>
        )}
        
        <div className="test-accounts-hint">
          <small>
            Test accounts: 123, 12345, 67890 (electricity) | INT123, INT456 (internet) | GOV001 (government) | 1234567890, 9876543210, 5555555555 (mobile) | TV12345, TV67890 (tv)
          </small>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="within-btn within-btn-secondary" onClick={() => {
          scrollToTop();
          onBack();
        }}>
          Cancel
        </button>
        <button 
          type="button" 
          className="verify-btn"
          onClick={verifyAccount}
          disabled={verifying}
        >
          {verifying ? <><FaSpinner className="spinner" /> Verifying...</> : 'Verify Account'}
        </button>
      </div>
    </div>
  );

  // Render Step 2: Payment Details (for non-mobile/tv categories)
  const renderStep2 = () => (
    <div className="form-step">
      {isAutoFilled && (
        <div className="verification-success">
          <FaCheck /> Account Verified! Details have been automatically filled.
        </div>
      )}
      
      {customerDetails && (
        <div className="customer-info">
          <h4>Account Details</h4>
          <div className="customer-name">{customerDetails.name}</div>
          <div className="customer-details">
            {customerDetails.billNumber && <div>Bill Number: {customerDetails.billNumber}</div>}
            {customerDetails.dueDate && <div>Due Date: {customerDetails.dueDate}</div>}
            {customerDetails.planType && <div>Plan: {customerDetails.planType}</div>}
            {customerDetails.serviceType && <div>Service: {customerDetails.serviceType}</div>}
            {customerDetails.accountType && <div>Type: {customerDetails.accountType}</div>}
          </div>
        </div>
      )}
      
      {/* Amount Field */}
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <div className="amount-input-wrapper">
          <span className="currency-symbol">TZS </span>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`amount-input ${errors.amount ? 'error' : ''} ${isAutoFilled ? 'auto-filled' : ''}`}
            placeholder="0.00"
            step="0.01"
            readOnly={isAutoFilled}
          />
        </div>
        {errors.amount && (
          <div className="error-message">{errors.amount}</div>
        )}
        {/* {isAutoFilled && (
          <div className="auto-fill-note">
            ✓ Amount automatically filled from your bill
          </div>
        )} */}
        
        {!isAutoFilled && (
          <div className="quick-amounts">
            {quickAmounts.map(amount => (
              <button
                key={amount}
                type="button"
                className={`quick-amount-btn ${parseInt(formData.amount) === amount ? 'active' : ''}`}
                onClick={() => {
                  scrollToTop();
                  updateFormData('amount', amount.toString());
                }}
              >
                TZS {amount}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Dynamic Form Fields */}
      {getFormFields().map(field => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={`${errors[field.name] ? 'error' : ''} ${isAutoFilled && field.canAutoFill ? 'auto-filled' : ''}`}
            placeholder={field.placeholder}
            readOnly={isAutoFilled && field.canAutoFill}
          />
          {errors[field.name] && (
            <div className="error-message">{errors[field.name]}</div>
          )}
          {/* {isAutoFilled && field.canAutoFill && formData[field.name] && (
            <div className="auto-fill-note">
              ✓ {field.label} automatically filled
            </div>
          )} */}
        </div>
      ))}
      
      {/* Save for Later */}
      {/* <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="saveForLater"
          name="saveForLater"
          checked={formData.saveForLater}
          onChange={handleChange}
        />
        <label htmlFor="saveForLater" className="checkbox-label">
          <FaSave /> Save this bill for future payments
        </label>
      </div> */}
      
      {formData.saveForLater && (
        <div className="form-group">
          <label htmlFor="nickname">Nickname for this Bill</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className={errors.nickname ? 'error' : ''}
            placeholder="e.g., Home Electricity"
          />
          {errors.nickname && (
            <div className="error-message">{errors.nickname}</div>
          )}
        </div>
      )}
      
      <div className="form-actions">
        <button 
          type="button" 
          className="within-btn within-btn-secondary"
          onClick={() => {
            scrollToTop();
            setCurrentStep(1);
            setAccountVerified(false);
            setIsAutoFilled(false);
            setCustomerDetails(null);
            setFormData(prev => ({
              ...prev,
              amount: '',
              name: '',
              email: '',
              phone: '',
              saveForLater: false,
              nickname: ''
            }));
          }}
        >
          Back to Account
        </button>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isProcessing}
        >
          {isProcessing ? <><FaSpinner className="spinner" /> Processing...</> : 'Continue to Payment'}
        </button>
      </div>
    </div>
  );

  // Render Mobile/TV Form with Plan Selection
  const renderMobileTVForm = () => (
    <div className="form-step">
      <div className="form-group">
        <label htmlFor="accountNumber">
          {provider.accountLabel || (category.id === 'mobile' ? 'Mobile Number' : 'Smart Card Number')}
        </label>
        <div className="input-with-button">
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className={errors.accountNumber ? 'error' : ''}
            placeholder={provider.accountHint || (category.id === 'mobile' ? "Enter your mobile number" : "Enter your smart card number")}
            disabled={accountVerified}
          />
          {!accountVerified && !verifying && (
            <button 
              type="button" 
              className="verify-btn"
              onClick={verifyAccount}
            >
              Verify
            </button>
          )}
          {verifying && (
            <div className="verifying-indicator">
              <FaSpinner className="spinner" /> Verifying...
            </div>
          )}
        </div>
        {errors.accountNumber && (
          <div className="error-message">{errors.accountNumber}</div>
        )}
        
        <div className="test-accounts-hint">
          <small>
            Test numbers: 1234567890, 9876543210, 5555555555 (mobile) | TV12345, TV67890 (tv)
          </small>
        </div>
      </div>
      
      {showPlans && (
        <>
          {accountVerified && (
            <div className="verification-success">
              <FaCheck /> Number Verified! 
              {customerDetails && ` Welcome back, ${customerDetails.name}!`}
            </div>
          )}

          {customerDetails && (
            <div className="customer-info">
              <h4>Account Information</h4>
              <div className="customer-name">{customerDetails.name}</div>
              <div className="customer-details">
                <div>Current Plan: {customerDetails.currentPlan || customerDetails.currentPackage}</div>
                <div>Status: {customerDetails.accountStatus || customerDetails.smartCardStatus}</div>
                {customerDetails.balance && <div>Balance: TZS {customerDetails.balance}</div>}
                {customerDetails.lastRecharge && <div>Last Recharge: {customerDetails.lastRecharge}</div>}
                {customerDetails.expiryDate && <div>Expires: {customerDetails.expiryDate}</div>}
              </div>
            </div>
          )}
        
          <div className="form-group">
            <label>Select Plan</label>
            <div className="plans-container">
              {plans.map(plan => (
                <button 
                  key={plan.id}
                  type="button"
                  className={`plan-option ${formData.selectedPlan?.id === plan.id ? 'active' : ''}`}
                  onClick={() => selectPlan(plan)}
                >
                  <div className="plan-header">
                    <div className="plan-name">{plan.name}</div>
                    <div className="plan-amount">TZS {plan.amount}</div>
                  </div>
                  <div className="plan-details">
                    <div className="plan-description">{plan.description}</div>
                    <div className="plan-features">
                      {plan.validity && <span>⏱ {plan.validity}</span>}
                      {plan.data && <span>📶 {plan.data}</span>}
                      {plan.sms && <span>💬 {plan.sms}</span>}
                      {plan.channels && <span>📺 {plan.channels}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Dynamic Form Fields */}
          {getFormFields().map(field => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`${errors[field.name] ? 'error' : ''} ${isAutoFilled && field.canAutoFill ? 'auto-filled' : ''}`}
                placeholder={field.placeholder}
                readOnly={isAutoFilled && field.canAutoFill}
              />
              {errors[field.name] && (
                <div className="error-message">{errors[field.name]}</div>
              )}
              {/* {isAutoFilled && field.canAutoFill && formData[field.name] && (
                <div className="auto-fill-note">
                  ✓ {field.label} automatically filled
                </div>
              )} */}
            </div>
          ))}
          
          {/* Save for Later */}
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="saveForLater"
              name="saveForLater"
              checked={formData.saveForLater}
              onChange={handleChange}
            />
            <label htmlFor="saveForLater" className="checkbox-label">
              <FaSave /> Save this bill for future payments
            </label>
          </div>
          
          {formData.saveForLater && (
            <div className="form-group">
              <label htmlFor="nickname">Nickname for this Bill</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className={errors.nickname ? 'error' : ''}
                placeholder={`e.g., My ${category.id === 'mobile' ? 'Mobile' : 'TV'}`}
              />
              {errors.nickname && (
                <div className="error-message">{errors.nickname}</div>
              )}
            </div>
          )}
        </>
      )}
      
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={() => {
          scrollToTop();
          onBack();
        }}>
          Cancel
        </button>
        {showPlans && (
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isProcessing}
          >
            {isProcessing ? <><FaSpinner className="spinner" /> Processing...</> : 'Continue to Payment'}
          </button>
        )}
      </div>
    </div>
  );

  // Main render logic
  const renderCurrentStep = () => {
    if (['mobile', 'tv'].includes(category.id)) {
      return renderMobileTVForm();
    } else {
      if (currentStep === 1) {
        return renderStep1();
      } else {
        return renderStep2();
      }
    }
  };

  return (
    <div className="billing-form-container">
      {showOTP && renderOTPModule()}
      
      <div className="form-header">
        <button className="back-button" onClick={() => {
          scrollToTop();
          onBack();
        }}>
          <FaArrowLeft /> Back
        </button>
        <h2>Pay {provider.name}</h2>
      </div>
      
      <div className="provider-info">
        <div className="provider-logo">
          <img src={provider.logo} alt={provider.name} />
        </div>
        <div className="provider-details">
          <h3>{provider.name}</h3>
          <p>{category.name}</p>
        </div>
      </div>
      
      <form className="payment-form" onSubmit={handleSubmit}>
        {renderCurrentStep()}
      </form>
    </div>
  );
};

export default BillPayForm;
