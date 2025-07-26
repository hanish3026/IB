import React, { useState } from 'react';
import { FaUser, FaWallet, FaPlus } from 'react-icons/fa';
import '../css/TransferMoney.css';

const TransferMoney = ({ onTransferComplete }) => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    recipientId: '',
    recipientName: '',
    recipientAccount: '',
    amount: '',
    note: ''
  });

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const recentRecipients = [
    { id: 'R001', name: 'John Smith', accountNumber: '****1234' },
    { id: 'R002', name: 'Sarah Johnson', accountNumber: '****5678' }
  ];
  
  const sourceAccounts = [
    { id: 'SA001', name: 'Main Account', balance: 'TZS  1,250.00', accountNumber: '****9012' },
    { id: 'SA002', name: 'Savings Account', balance: 'TZS  3,425.50', accountNumber: '****3456' }
  ];

  const presetAmounts = [100, 500, 1000, 5000];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRecipientSelect = (recipient) => {
    setFormData(prevState => ({
      ...prevState,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientAccount: recipient.accountNumber
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        // onTransferComplete('success', 'Transfer completed successfully');
        alert("'success', 'Transfer completed successfully'")
      }, 1500);
    }
  };

  return (
    <form className="transfer-form" onSubmit={handleSubmit}>
      {step === 1 ? (
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">From Account</label>
            <div className="account-options">
              {sourceAccounts.map((account) => (
                <div 
                  key={account.id}
                  className={`account-card ${formData.fromAccount === account.id ? 'selected' : ''}`}
                  onClick={() => handleChange({ target: { name: 'fromAccount', value: account.id } })}
                >
                  <div className="account-icon">
                    <FaWallet />
                  </div>
                  <div className="account-details">
                    <div className="account-name">{account.name}</div>
                    <div className="account-number">
                      {account.accountNumber} <span className="balance">{account.balance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Recipient</label>
            <div className="recipient-options">
              {recentRecipients.map((recipient) => (
                <div 
                  key={recipient.id}
                  className={`recipient-card ${formData.recipientId === recipient.id ? 'selected' : ''}`}
                  onClick={() => handleRecipientSelect(recipient)}
                >
                  <div className="recipient-icon">
                    <FaUser />
                  </div>
                  <div className="recipient-details">
                    <div className="recipient-name">{recipient.name}</div>
                    <div className="recipient-account">{recipient.accountNumber}</div>
                  </div>
                </div>
              ))}
              <div 
                className={`recipient-card add-new ${formData.recipientId === 'new' ? 'selected' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, recipientId: 'new' }))}
              >
                <div className="recipient-icon">
                  <FaPlus />
                </div>
                <div className="recipient-details">
                  <div className="recipient-name">New Recipient</div>
                  <div className="recipient-account">Add new account</div>
                </div>
              </div>
            </div>
          </div>

          {formData.recipientId === 'new' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="recipientName">Recipient Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="recipientAccount">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="recipientAccount"
                  name="recipientAccount"
                  value={formData.recipientAccount}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              required
            />
            <div className="preset-amounts">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  className={`preset-amount-btn ${formData.amount === amount.toString() ? 'active' : ''}`}
                  onClick={() => handleChange({ target: { name: 'amount', value: amount.toString() } })}
                >
                  TZS  {amount}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="note">Note (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add a note"
            />
          </div>
        </div>
      ) : (
        <div className="confirmation-section">
          <h3>Confirm Transfer Details</h3>
          <div className="confirmation-details">
            <div className="detail-row">
              <span>From Account</span>
              <span>{sourceAccounts.find(a => a.id === formData.fromAccount)?.name}</span>
            </div>
            <div className="detail-row">
              <span>To</span>
              <span>{formData.recipientName}</span>
            </div>
            <div className="detail-row">
              <span>Amount</span>
              <span>TZS  {formData.amount}</span>
            </div>
            {formData.note && (
              <div className="detail-row">
                <span>Note</span>
                <span>{formData.note}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="btn-container">
        {step === 2 && (
          <button 
            type="button" 
            className="action-button secondary"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        )}
        <button 
          type="submit" 
          className="action-button"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : step === 1 ? 'Continue' : 'Confirm Transfer'}
        </button>
      </div>
    </form>
  );
};

export default TransferMoney;