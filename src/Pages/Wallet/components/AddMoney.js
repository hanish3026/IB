import React, { useState } from 'react';
import '../css/wallet.css';
// Import the new CSS file
import '../css/AddMoney.css';

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  // const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  // Sample linked accounts
  const linkedAccounts = [
    { id: 'BA001', name: 'Bank of America', accountNumber: '****1234', type: 'bank' },
    { id: 'BA002', name: 'Chase Bank', accountNumber: '****5678', type: 'bank' },
    { id: 'CC001', name: 'Visa Credit Card', accountNumber: '****4321', type: 'card' },
    { id: 'CC002', name: 'Mastercard', accountNumber: '****8765', type: 'card' }
  ];

  // Preset amounts
  const presetAmounts = [100, 500, 1000, 2000, 5000];

  // useEffect(() => {
  //   // Filter out card accounts
  //   const cards = linkedAccounts.filter(account => account.type === 'card');
  //   setSavedCards(cards);
  // },linkedAccounts);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate amount
    if (parseFloat(amount) < 100) {
      setFormError('Minimum amount should be TZS  100');
      return;
    }
    
    // Simulate processing
    setIsProcessing(true);
    setFormError('');
    
    // Mock API call
    setTimeout(() => {
      console.log('Adding money:', { amount, source });
      setIsProcessing(false);
      setFormSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setAmount('');
        setSource('');
        setSelectedPreset(null);
        setFormSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handlePresetClick = (preset) => {
    setAmount(preset.toString());
    setSelectedPreset(preset);
  };

  const handleNewCardToggle = () => {
    setShowAddCard(!showAddCard);
  };

  return (
    <div className="wallet-container wallet-section">      
      {formSuccess ? (
        <div className="wallet-card wallet-fade-in">
          <div className="wallet-card-body text-center p-5">
            <div className="success-animation">
              <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: 'var(--wallet-success)' }}></i>
            </div>
            <h4 className="mt-4">Money Added Successfully!</h4>
            <p className="text-muted">TZS  {amount} has been added to your wallet</p>
            <button 
              className="action-button primary mt-3"
              onClick={() => setFormSuccess(false)}
            >
              <i className="fa-solid fa-plus"></i> Add More Money
            </button>
          </div>
        </div>
      ) : (
        <div className="wallet-card wallet-fade-in">
          <div className="wallet-card-header">
            <h5 className="mb-0">Add Money to Wallet</h5>
          </div>
          <div className="wallet-card-body">
            <form onSubmit={handleSubmit}>
              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}
              
              <div className="mb-4 wallet-fade-in-delay-1">
                <label htmlFor="addAmount" className="form-label fw-semibold">Amount</label>
                <div className="input-group">
                  <span className="input-group-text">TZS  </span>
                  <input 
                    type="number" 
                    className="form-control text-black" 
                    id="addAmount" 
                    placeholder="Enter amount" 
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedPreset(null);
                    }}
                    required
                  />
                </div>
                <small className="text-muted">Minimum amount: TZS  100</small>
                
                <div className="preset-amounts mt-3">
                  <p className="mb-2 small text-muted">Quick select:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {presetAmounts.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        className={`preset-amount-btn ${selectedPreset === preset ? 'active' : ''}`}
                        onClick={() => handlePresetClick(preset)}
                      >
                        TZS  {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-4 wallet-fade-in-delay-1">
                <label className="form-label fw-semibold">Payment Method</label>
                
                <div className="payment-methods">
                  <div className="row">
                    {linkedAccounts.map(account => (
                      <div key={account.id} className="col-md-6 mb-3">
                        <div 
                          className={`payment-method-card ${source === account.id ? 'selected' : ''}`}
                          onClick={() => setSource(account.id)}
                        >
                          <div className="payment-method-icon">
                            {account.type === 'bank' ? (
                              <i className="fa-solid fa-building-columns"></i>
                            ) : (
                              <i className="fa-solid fa-credit-card"></i>
                            )}
                          </div>
                          <div className="payment-method-details">
                            <div className="payment-method-name">{account.name}</div>
                            <div className="payment-method-number">{account.accountNumber}</div>
                          </div>
                          <div className="payment-method-radio">
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              checked={source === account.id}
                              onChange={() => setSource(account.id)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="col-md-6 mb-3">
                      <div 
                        className="payment-method-card add-new"
                        onClick={handleNewCardToggle}
                      >
                        <div className="payment-method-icon">
                          <i className="fa-solid fa-plus"></i>
                        </div>
                        <div className="payment-method-details">
                          <div className="payment-method-name">Add New Payment Method</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {showAddCard && (
                  <div className="add-new-card mt-3 p-3 border rounded">
                    <h6 className="mb-3">Add New Payment Method</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Card Number</label>
                        <input type="text" className="form-control" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Name on Card</label>
                        <input type="text" className="form-control" placeholder="Hanish" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Expiry Date</label>
                        <input type="text" className="form-control" placeholder="MM/YY" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">CVV</label>
                        <input type="text" className="form-control" placeholder="XXX" />
                      </div>
                      <div className="col-12 mt-3">
                        <button type="button" className="action-button primary my-2">
                          Save Card
                        </button>
                        <button 
                          type="button" 
                          className="action-button secondary"
                          onClick={handleNewCardToggle}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="transaction-details mb-4 p-3 bg-light rounded wallet-fade-in-delay-2">
                <h6 className="mb-3">Transaction Details</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Amount:</span>
                  <span className="fw-bold">TZS  {amount || '0'}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Transaction Fee:</span>
                  <span className="fw-bold text-success">FREE</span>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">TZS  {amount || '0'}</span>
                </div>
              </div>
              
              <div className="mt-4 wallet-fade-in-delay-2">
                <button 
                  type="submit" 
                  className="action-button primary my-2"
                  disabled={isProcessing || !amount || !source}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus"></i> Add Money
                    </>
                  )}
                </button>
                <button type="button" className="action-button secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMoney;