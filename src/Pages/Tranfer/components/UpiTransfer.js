import React, { useState } from 'react';
import '../css/OwnAccountTransfer.css';

const UpiTransfer = ({ onTransferComplete }) => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    upiId: '',
    amount: '',
    remarks: '',
    beneficiaryName: ''
  });

  // Mock data for demo purposes
  const userAccounts = [
    { id: '1', number: '1234567890', type: 'Savings', balance: 50000 },
    { id: '2', number: '9876543210', type: 'Current', balance: 100000 }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUpiId = (upiId) => {
    // UPI ID format: username@bankname
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    return upiRegex.test(upiId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      onTransferComplete('error', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(formData.amount) > 100000) {
      onTransferComplete('error', 'Maximum UPI transfer limit is TZS  1,00,000 per transaction');
      return;
    }

    if (!validateUpiId(formData.upiId)) {
      onTransferComplete('error', 'Invalid UPI ID format');
      return;
    }

    // Mock successful transfer
    setTimeout(() => {
      onTransferComplete('success', 'UPI Transfer completed successfully! The amount has been transferred instantly.');
      setFormData({
        fromAccount: '',
        upiId: '',
        amount: '',
        remarks: '',
        beneficiaryName: ''
      });
    }, 1000);
  };

  const formatAccountNumber = (account) => {
    return `${account.number} (${account.type})`;
  };

  return (
    <div className="transfer-container">
      <form className="transfer-form" onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From Account</label>
              <select
                className="form-select"
                name="fromAccount"
                value={formData.fromAccount}
                onChange={handleChange}
                required
              >
                <option value="">Select your account</option>
                {userAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {formatAccountNumber(account)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Beneficiary Name</label>
              <input
                type="text"
                className="form-input"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={handleChange}
                placeholder="Enter beneficiary name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">UPI ID</label>
              <input
                type="text"
                className="form-input"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="Enter UPI ID (e.g., name@bank)"
                required
              />
              <span className="form-helper">Format: username@bankname</span>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (TZS  )</label>
              <input
                type="number"
                className="form-input"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                min="1"
                max="100000"
              />
              <span className="form-helper">Maximum limit: TZS  1,00,000 per transaction</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Remarks (Optional)</label>
              <input
                type="text"
                className="form-input"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Add remarks"
                maxLength={50}
              />
              <span className="form-helper">Maximum 50 characters</span>
            </div>
            
            <div className="form-group">
              {/* Empty group to maintain layout balance */}
            </div>
          </div>
        </div>

        <button type="submit" className="action-button">
          Send Money
        </button>
      </form>
    </div>
  );
};

export default UpiTransfer;
