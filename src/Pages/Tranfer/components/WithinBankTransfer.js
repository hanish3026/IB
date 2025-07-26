import React, { useState, useEffect } from 'react';
import '../css/WithinBankTransfer.css';

const WithinBankTransfer = ({ onTransferComplete }) => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    beneficiaryAccount: '',
    amount: '',
    remarks: '',
    beneficiaryName: '',
    ifscCode: ''
  });
  const [errors, setErrors] = useState({});
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock data for demo purposes
  const userAccounts = [
    { id: '1', number: '1234567890', type: 'Savings', balance: 50000 },
    { id: '2', number: '9876543210', type: 'Current', balance: 100000 }
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
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = 'Insufficient funds in your account';
    } else if (parseFloat(formData.amount) > 1000000) {
      newErrors.amount = 'Amount exceeds maximum transfer limit of TZS  10,00,000';
    }
    
    // Validate remarks if entered
    if (formData.remarks && formData.remarks.length > 50) {
      newErrors.remarks = 'Remarks cannot exceed 50 characters';
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
      onTransferComplete('success', 'Transfer completed successfully!');
      
      // Reset form
      setFormData({
        fromAccount: '',
        beneficiaryAccount: '',
        amount: '',
        remarks: '',
        beneficiaryName: '',
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
    <div className="withinBank-container">
      {!showConfirmation ? (
        <form className="withinBank-form" onSubmit={handleSubmit}>
          <h2 className="withinBank-title">Transfer to Account Within Bank</h2>
          
          <div className="withinBank-form-content">
            <div className="withinBank-form-row">
              <div className="withinBank-form-group">
                <label className="withinBank-form-label" htmlFor="fromAccount">From Account</label>
                <select
                  className={`withinBank-form-select ${errors.fromAccount ? 'withinBank-error-input' : ''}`}
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
                {errors.fromAccount && <span className="withinBank-error-message">{errors.fromAccount}</span>}
                
                {formData.fromAccount && (
                  <div className="withinBank-account-info">
                    <span className="withinBank-account-balance">Available Balance: TZS  {availableBalance.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="withinBank-form-group">
                <label className="withinBank-form-label" htmlFor="beneficiaryAccount">Beneficiary Account Number</label>
                <input
                  type="text"
                  className={`withinBank-form-input ${errors.beneficiaryAccount ? 'withinBank-error-input' : ''}`}
                  id="beneficiaryAccount"
                  name="beneficiaryAccount"
                  value={formData.beneficiaryAccount}
                  onChange={handleChange}
                  placeholder="Enter beneficiary account number"
                  required
                />
                {errors.beneficiaryAccount ? (
                  <span className="withinBank-error-message">{errors.beneficiaryAccount}</span>
                ) : (
                  <span className="withinBank-form-helper">Account number should be 9-18 digits</span>
                )}
              </div>
            </div>

            <div className="withinBank-form-row">
              <div className="withinBank-form-group">
                <label className="withinBank-form-label" htmlFor="beneficiaryName">Beneficiary Name</label>
                <input
                  type="text"
                  className={`withinBank-form-input ${errors.beneficiaryName ? 'withinBank-error-input' : ''}`}
                  id="beneficiaryName"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  placeholder="Enter beneficiary name"
                  required
                />
                {errors.beneficiaryName && <span className="withinBank-error-message">{errors.beneficiaryName}</span>}
              </div>

              <div className="withinBank-form-group">
                <label className="withinBank-form-label" htmlFor="ifscCode">IFSC Code</label>
                <input
                  type="text"
                  className={`withinBank-form-input ${errors.ifscCode ? 'withinBank-error-input' : ''}`}
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                  required
                />
                {errors.ifscCode ? (
                  <span className="withinBank-error-message">{errors.ifscCode}</span>
                ) : (
                  <span className="withinBank-form-helper">Example: SBIN0123456</span>
                )}
              </div>
            </div>

            <div className="withinBank-form-row">
              <div className="withinBank-form-group">
                <label className="withinBank-form-label" htmlFor="amount">Amount</label>
                <div className="withinBank-amount-input-wrapper">
                  <span className="withinBank-currency-symbol">TZS  </span>
                  <input
                    type="number"
                    className={`withinBank-form-input ${errors.amount ? 'withinBank-error-input' : ''}`}
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
                {errors.amount ? (
                  <span className="withinBank-error-message">{errors.amount}</span>
                ) : (
                  <span className="withinBank-form-helper">Maximum transfer limit: TZS  10,00,000</span>
                )}
              </div>

              <div className="withinBank-form-group">
                <label className="withinBank-form-label" htmlFor="remarks">Remarks (Optional)</label>
                <input
                  type="text"
                  className={`withinBank-form-input ${errors.remarks ? 'withinBank-error-input' : ''}`}
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="e.g., Rent payment, Gift"
                  maxLength={50}
                />
                <span className="withinBank-form-helper">
                  {formData.remarks.length}/50 characters
                </span>
                {errors.remarks && <span className="withinBank-error-message">{errors.remarks}</span>}
              </div>
            </div>
          </div>
          
          <div className="withinBank-form-actions">
            <button type="submit" className="withinBank-button withinBank-primary">
              Continue
            </button>
          </div>
        </form>
      ) : (
        <div className="withinBank-confirmation">
          <h2 className="withinBank-title">Confirm Transfer</h2>
          
          <div className="withinBank-confirmation-details">
            <div className="withinBank-confirmation-row">
              <span className="withinBank-confirmation-label">From Account:</span>
              <span className="withinBank-confirmation-value">
                {fromAccount ? `${fromAccount.number} (${fromAccount.type})` : ''}
              </span>
            </div>
            
            <div className="withinBank-confirmation-row">
              <span className="withinBank-confirmation-label">To Account:</span>
              <span className="withinBank-confirmation-value">
                {formData.beneficiaryAccount}
              </span>
            </div>
            
            <div className="withinBank-confirmation-row">
              <span className="withinBank-confirmation-label">Beneficiary Name:</span>
              <span className="withinBank-confirmation-value">
                {formData.beneficiaryName}
              </span>
            </div>
            
            <div className="withinBank-confirmation-row">
              <span className="withinBank-confirmation-label">IFSC Code:</span>
              <span className="withinBank-confirmation-value">
                {formData.ifscCode}
              </span>
            </div>
            
            <div className="withinBank-confirmation-row">
              <span className="withinBank-confirmation-label">Amount:</span>
              <span className="withinBank-confirmation-value withinBank-amount">
                TZS  {parseFloat(formData.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
            
            {formData.remarks && (
              <div className="withinBank-confirmation-row">
                <span className="withinBank-confirmation-label">Remarks:</span>
                <span className="withinBank-confirmation-value">{formData.remarks}</span>
              </div>
            )}
          </div>
          
          <div className="withinBank-confirmation-actions">
            <button 
              className="withinBank-button withinBank-secondary" 
              onClick={cancelTransfer}
              disabled={isProcessing}
            >
              Back
            </button>
            <button 
              className="withinBank-button withinBank-primary" 
              onClick={confirmTransfer}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="withinBank-processing">
                  <span className="withinBank-spinner"></span>
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

export default WithinBankTransfer;