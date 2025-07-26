import React, { useState } from 'react';

const WithdrawMoney = () => {
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const presetAmounts = [50, 100, 200, 500];

  const handlePresetAmount = (value) => {
    setAmount(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setAmount('');
    setSelectedAccount('');
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="withdraw-money card mb-3">
        <div className="card-header">
          Withdraw Money
        </div>
        <div className="card-body success-screen">
          <div className="success-animation">
            <div className="payment-method-icon" style={{ margin: '0 auto 20px', width: '60px', height: '60px' }}>
              <i className="fas fa-check"></i>
            </div>
            <h5>Withdrawal Successful!</h5>
            <p>Your withdrawal of ${amount} has been processed successfully.</p>
            <button 
              type="button" 
              className="btn btn-primary mt-3"
              onClick={resetForm}
            >
              Make Another Withdrawal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="withdraw-money card mb-3">
      <div className="card-header">
        Withdraw Money
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="withdrawAmount" className="form-label">Amount</label>
            <input 
              type="number" 
              className="form-control" 
              id="withdrawAmount" 
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="preset-amounts">
            {presetAmounts.map((presetAmount) => (
              <button
                type="button"
                key={presetAmount}
                className={`preset-amount-btn me-2 mb-2 ${amount === presetAmount ? 'active' : ''}`}
                onClick={() => handlePresetAmount(presetAmount)}
              >
                ${presetAmount}
              </button>
            ))}
          </div>
          
          <div className="mb-3">
            <label htmlFor="account" className="form-label">Select Account</label>
            <div className="payment-methods">
              {/* <div 
                className={`payment-method-card ${selectedAccount === '1' ? 'selected' : ''}`}
                onClick={() => setSelectedAccount('1')}
              >
                <div className="payment-method-icon">
                  <i className="fas fa-university"></i>
                </div>
                <div className="payment-method-details">
                  <div className="payment-method-name">Bank Account 1</div>
                  <div className="payment-method-number">**** 5678</div>
                </div>
                <div className="payment-method-radio">
                  <input 
                    type="radio" 
                    checked={selectedAccount === '1'} 
                    onChange={() => setSelectedAccount('1')}
                  />
                </div>
              </div> */}
              
              <div 
                className={`payment-method-card ${selectedAccount === '2' ? 'selected' : ''}`}
                onClick={() => setSelectedAccount('2')}
              >
                <div className="payment-method-icon">
                  <i className="fas fa-university"></i>
                </div>
                <div className="payment-method-details">
                  <div className="payment-method-name">Bank Account 2</div>
                  <div className="payment-method-number">**** 9012</div>
                </div>
                <div className="payment-method-radio">
                  <input 
                    type="radio" 
                    checked={selectedAccount === '2'} 
                    onChange={() => setSelectedAccount('2')}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {amount && selectedAccount && (
            <div className="transaction-details mb-3">
              <h6>Transaction Details</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Withdrawal amount</span>
                <span>${amount}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Processing fee</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>${amount}</strong>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-danger w-100 mb-3"
            disabled={!amount || !selectedAccount || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              'Withdraw'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawMoney;