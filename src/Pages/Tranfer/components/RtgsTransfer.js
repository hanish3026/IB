import React, { useState, useEffect } from 'react';
import '../css/RtgsTransfer.css';

const RtgsTransfer = ({ onTransferComplete, selectedBeneficiary }) => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    beneficiaryAccount: selectedBeneficiary?.accountNumber || '',
    beneficiaryName: selectedBeneficiary?.name || '',
    bankName: selectedBeneficiary?.bankName || '',
    ifscCode: selectedBeneficiary?.ifscCode || '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock data for demo purposes
  const userAccounts = [
    { id: '1', number: '1234567890', type: 'Savings', balance: 500000 },
    { id: '2', number: '9876543210', type: 'Current', balance: 1000000 }
  ];

  // Update available balance when from account changes
  useEffect(() => {
    if (formData.fromAccount) {
      const selectedAccount = userAccounts.find(acc => acc.id === formData.fromAccount);
      if (selectedAccount) {
        setAvailableBalance(selectedAccount.balance);
      }
    } else {
      setAvailableBalance(0);
    }
  }, [formData.fromAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
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

  const validateForm = () => {
    const newErrors = {};
    
    // Validate from account
    if (!formData.fromAccount) {
      newErrors.fromAccount = 'Please select a source account';
    }
    
    // Validate beneficiary account
    if (!formData.beneficiaryAccount) {
      newErrors.beneficiaryAccount = 'Please enter beneficiary account number';
    } else if (!/^[0-9]{9,18}$/.test(formData.beneficiaryAccount)) {
      newErrors.beneficiaryAccount = 'Account number should be 9-18 digits';
    }
    
    // Validate beneficiary name
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = 'Please enter beneficiary name';
    } else if (formData.beneficiaryName.length < 3) {
      newErrors.beneficiaryName = 'Name should be at least 3 characters';
    }
    
    // Validate bank name
    if (!formData.bankName) {
      newErrors.bankName = 'Please enter bank name';
    }
    
    // Validate IFSC code
    if (!formData.ifscCode) {
      newErrors.ifscCode = 'Please enter IFSC code';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC Code format (e.g., SBIN0123456)';
    }
    
    // Validate amount
    if (!formData.amount) {
      newErrors.amount = 'Please enter an amount';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (parseFloat(formData.amount) < 200000) {
      newErrors.amount = 'RTGS transfers require a minimum amount of TZS  2,00,000';
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = 'Insufficient funds in your account';
    } else if (parseFloat(formData.amount) > 10000000) {
      newErrors.amount = 'Amount exceeds maximum RTGS transfer limit of TZS  1,00,00,000';
    }
    
    // Validate description if entered
    if (formData.description && formData.description.length > 50) {
      newErrors.description = 'Description cannot exceed 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const confirmTransfer = () => {
    setIsProcessing(true);
    
    // Mock successful transfer with a delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      onTransferComplete('success', 'RTGS Transfer initiated successfully!');
      
      // Reset form
      setFormData({
        fromAccount: '',
        beneficiaryAccount: '',
        amount: '',
        description: '',
        beneficiaryName: '',
        bankName: '',
        ifscCode: ''
      });
    }, 2000);
  };

  const cancelTransfer = () => {
    setShowConfirmation(false);
  };

  const formatAccountNumber = (account) => {
    return `${account.number.slice(0, 4)}...${account.number.slice(-4)} (${account.type}) - TZS  ${account.balance.toLocaleString()}`;
  };

  // Get selected account details
  const getSelectedAccount = (accountId) => {
    return userAccounts.find(acc => acc.id === accountId);
  };

  const fromAccount = getSelectedAccount(formData.fromAccount);

  return (
    <div className="rtgs-container">
      {!showConfirmation ? (
        <form className="rtgs-form" onSubmit={handleSubmit}>
          <h2 className="rtgs-title">RTGS Transfer</h2>
          
          <div className="rtgs-timing-info mb-3">
            <strong>RTGS Timings:</strong> RTGS transfers are processed in real-time from 7:00 AM to 6:00 PM on weekdays and 7:00 AM to 3:30 PM on Saturdays. Minimum transfer amount is TZS  2,00,000.
          </div>
          
          <div className="rtgs-form-content">
            <div className="rtgs-form-row">
              <div className="rtgs-form-group">
                <label className="rtgs-form-label" htmlFor="fromAccount">From Account</label>
                <select
                  className={`rtgs-form-select ${errors.fromAccount ? 'rtgs-error-input' : ''}`}
                  id="fromAccount"
                  name="fromAccount"
                  value={formData.fromAccount}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select source account</option>
                  {userAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {formatAccountNumber(account)}
                    </option>
                  ))}
                </select>
                {errors.fromAccount && <span className="rtgs-error-message">{errors.fromAccount}</span>}
                
                {formData.fromAccount && (
                  <div className="rtgs-account-info">
                    <span className="rtgs-account-balance">Available Balance: TZS  {availableBalance.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="rtgs-form-group">
                <label className="rtgs-form-label" htmlFor="beneficiaryAccount">Beneficiary Account Number</label>
                <input
                  type="text"
                  className={`rtgs-form-input ${errors.beneficiaryAccount ? 'rtgs-error-input' : ''}`}
                  id="beneficiaryAccount"
                  name="beneficiaryAccount"
                  value={formData.beneficiaryAccount}
                  onChange={handleChange}
                  placeholder="Enter beneficiary account number"
                  required
                />
                {errors.beneficiaryAccount ? (
                  <span className="rtgs-error-message">{errors.beneficiaryAccount}</span>
                ) : (
                  <span className="rtgs-form-helper">Account number should be 9-18 digits</span>
                )}
              </div>
            </div>

            <div className="rtgs-form-row">
              <div className="rtgs-form-group">
                <label className="rtgs-form-label" htmlFor="beneficiaryName">Beneficiary Name</label>
                <input
                  type="text"
                  className={`rtgs-form-input ${errors.beneficiaryName ? 'rtgs-error-input' : ''}`}
                  id="beneficiaryName"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  placeholder="Enter beneficiary name"
                  required
                />
                {errors.beneficiaryName && <span className="rtgs-error-message">{errors.beneficiaryName}</span>}
              </div>

              <div className="rtgs-form-group">
                <label className="rtgs-form-label" htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  className={`rtgs-form-input ${errors.bankName ? 'rtgs-error-input' : ''}`}
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  required
                />
                {errors.bankName && <span className="rtgs-error-message">{errors.bankName}</span>}
              </div>
            </div>

            <div className="rtgs-form-row">
              <div className="rtgs-form-group">
                <label className="rtgs-form-label" htmlFor="ifscCode">IFSC Code</label>
                <input
                  type="text"
                  className={`rtgs-form-input ${errors.ifscCode ? 'rtgs-error-input' : ''}`}
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                  required
                />
                {errors.ifscCode ? (
                  <span className="rtgs-error-message">{errors.ifscCode}</span>
                ) : (
                  <span className="rtgs-form-helper">Example: SBIN0123456</span>
                )}
              </div>

              <div className="rtgs-form-group">
                <label className="rtgs-form-label" htmlFor="amount">Amount</label>
                <div className="rtgs-amount-input-wrapper">
                  <span className="rtgs-currency-symbol">TZS  </span>
                  <input
                    type="number"
                    className={`rtgs-form-input ${errors.amount ? 'rtgs-error-input' : ''}`}
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    min="200000"
                    step="0.01"
                  />
                </div>
                {errors.amount ? (
                  <span className="rtgs-error-message">{errors.amount}</span>
                ) : (
                  <span className="rtgs-form-helper">Minimum: TZS  2,00,000 | Maximum: TZS  1,00,00,000</span>
                )}
              </div>
            </div>

            <div className="rtgs-form-group">
              <label className="rtgs-form-label" htmlFor="description">Description (Optional)</label>
              <input
                type="text"
                className={`rtgs-form-input ${errors.description ? 'rtgs-error-input' : ''}`}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Property payment, Business transaction"
                maxLength={50}
              />
              <span className="rtgs-form-helper">
                {formData.description.length}/50 characters
              </span>
              {errors.description && <span className="rtgs-error-message">{errors.description}</span>}
            </div>
          </div>
          
          <div className="rtgs-form-actions">
            <button type="submit" className="rtgs-button rtgs-primary">
              Continue
            </button>
          </div>
        </form>
      ) : (
        <div className="rtgs-confirmation">
          <h2 className="rtgs-title">Confirm RTGS Transfer</h2>
          
          <div className="rtgs-confirmation-details">
            <div className="rtgs-confirmation-row">
              <span className="rtgs-confirmation-label">From Account:</span>
              <span className="rtgs-confirmation-value">
                {fromAccount ? `${fromAccount.number} (${fromAccount.type})` : ''}
              </span>
            </div>
            
            <div className="rtgs-confirmation-row">
              <span className="rtgs-confirmation-label">To Account:</span>
              <span className="rtgs-confirmation-value">
                {formData.beneficiaryAccount}
              </span>
            </div>
            
            <div className="rtgs-confirmation-row">
              <span className="rtgs-confirmation-label">Beneficiary Name:</span>
              <span className="rtgs-confirmation-value">
                {formData.beneficiaryName}
              </span>
            </div>
            
            <div className="rtgs-confirmation-row">
              <span className="rtgs-confirmation-label">Bank Name:</span>
              <span className="rtgs-confirmation-value">
                {formData.bankName}
              </span>
            </div>
            
            <div className="rtgs-confirmation-row">
              <span className="rtgs-confirmation-label">IFSC Code:</span>
              <span className="rtgs-confirmation-value">
                {formData.ifscCode}
              </span>
            </div>
            
            <div className="rtgs-confirmation-row">
              <span className="rtgs-confirmation-label">Amount:</span>
              <span className="rtgs-confirmation-value rtgs-amount">
                TZS  {parseFloat(formData.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
            
            {formData.description && (
              <div className="rtgs-confirmation-row">
                <span className="rtgs-confirmation-label">Description:</span>
                <span className="rtgs-confirmation-value">{formData.description}</span>
              </div>
            )}
          </div>
          
          <div className="rtgs-timing-info">
            <strong>Note:</strong> RTGS transfers are processed in real-time during banking hours. The beneficiary will typically receive the funds within 30 minutes.
          </div>
          
          <div className="rtgs-confirmation-actions">
            <button 
              className="rtgs-button rtgs-secondary" 
              onClick={cancelTransfer}
              disabled={isProcessing}
            >
              Back
            </button>
            <button 
              className="rtgs-button rtgs-primary" 
              onClick={confirmTransfer}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="rtgs-processing">
                  <span className="rtgs-spinner"></span>
                  Processing...
                </span>
              ) : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RtgsTransfer;
