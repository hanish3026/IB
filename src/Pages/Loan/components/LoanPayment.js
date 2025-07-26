import React, { useState } from 'react';
import "../css/Loan.css"
const LoanPayment = () => {
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);

  // Sample data
  const activeLoans = [
    { id: 'L001', name: 'Home Loan', remaining: 1850000, nextPayment: 12500, dueDate: '2025-03-15', icon: 'house' },
    { id: 'L002', name: 'Personal Loan', remaining: 85000, nextPayment: 7500, dueDate: '2025-03-20', icon: 'wallet' }
  ];
  
  const paymentMethods = [
    { id: 'PM001', name: 'Savings Account', accountNumber: '****4321', icon: 'bank', balance: 'TZS  34,500' },
    { id: 'PM002', name: 'Wallet Balance', accountNumber: 'Primary Wallet', icon: 'wallet', balance: 'TZS  10,000' }
  ];

  const handleLoanSelect = (loan) => {
    setLoanId(loan.id);
    setAmount(loan.nextPayment.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
    } else {
      setIsProcessing(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  const resetForm = () => {
    setLoanId('');
    setAmount('');
    setPaymentMethod('');
    setIsSuccess(false);
    setStep(1);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const absAmount = Math.abs(parseFloat(amount));
    return `TZS  ${absAmount.toLocaleString()}`;
  };

  if (isSuccess) {
    return (
      <div className="wallet-card wallet-fade-in">
        <div className="wallet-card-header">
          <h5 className="mb-0">Loan Payment</h5>
        </div>
        <div className="success-screen">
          <div className="success-animation">
            <div className="checkmark-circle">
              <i className="fas fa-check"></i>
                </div>
              </div>
              
          <div className="success-content">
            <h4 className="success-title">Payment Successful!</h4>
            <p className="success-message">Your loan payment has been processed successfully</p>
            
            <div className="success-details">
              <div className="success-detail-item">
                <div className="detail-label">Amount Paid</div>
                <div className="detail-value highlight">{formatCurrency(amount)}</div>
                  </div>
                  
              <div className="success-detail-item">
                <div className="detail-label">Loan Type</div>
                <div className="detail-value">
                  <i className={`fas fa-${activeLoans.find(loan => loan.id === loanId)?.icon}`}></i>
                  {activeLoans.find(loan => loan.id === loanId)?.name}
                </div>
              </div>
              
              <div className="success-detail-item">
                <div className="detail-label">Payment Method</div>
                <div className="detail-value">
                  <i className={`fas fa-${paymentMethods.find(method => method.id === paymentMethod)?.icon}`}></i>
                  {paymentMethods.find(method => method.id === paymentMethod)?.name}
                </div>
              </div>
              
              <div className="success-detail-item">
                <div className="detail-label">Transaction ID</div>
                <div className="detail-value">TXN{Math.floor(Math.random() * 1000000)}</div>
              </div>
              
              <div className="success-detail-item">
                <div className="detail-label">Date & Time</div>
                <div className="detail-value">{new Date().toLocaleString()}</div>
              </div>
            </div>

            <div className="success-actions">
              <button 
                className="action-button primary"
                onClick={() => {
                  // Add download receipt logic here
                  console.log('Downloading receipt...');
                }}
              >
                <i className="fas fa-download me-2"></i>
                Download Receipt
              </button>
              
              <button 
                className="action-button secondary"
                onClick={resetForm}
              >
                <i className="fas fa-redo me-2"></i>
                Make Another Payment
              </button>
            </div>

            <div className="success-footer">
              <div className="success-note">
                <i className="fas fa-info-circle me-2"></i>
                A confirmation email has been sent to your registered email address
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-card wallet-fade-in">
      <div className="wallet-card-header">
        <h5 className="mb-0">Loan Payment</h5>
      </div>
      <div className="wallet-card-body">
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div className="mb-4">
                <div className="section-title wallet-fade-in-delay-1">Select Loan</div>
                <div className="payment-methods">
                  {activeLoans.map((loan) => (
                    <div 
                      key={loan.id}
                      className={`account-item cursor-pointer ${loanId === loan.id ? 'selected-item' : ''}`}
                      onClick={() => handleLoanSelect(loan)}
                      style={{ border: loanId === loan.id ? '2px solid var(--wallet-primary, #3a7bd5)' : '1px solid #e0e0e0', 
                               borderRadius: '8px', padding: '12px',
                               backgroundColor: loanId === loan.id ? 'rgba(58, 123, 213, 0.05)' : 'white' }}
                    >
                      <div className="account-details">
                        <div className="">
                          <i className={`fa-solid fa-${loan.icon}`}></i>
                        </div>
                        <div className="account-info">
                          <span className="account-name">{loan.name}</span>
                          <span className="account-number">
                            Outstanding: {formatCurrency(loan.remaining)}
                          </span>
                          <span className="account-number">
                            <small>Next payment: {formatCurrency(loan.nextPayment)} due on {loan.dueDate}</small>
                          </span>
                        </div>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="loanSelection" 
                          checked={loanId === loan.id}
                          onChange={() => handleLoanSelect(loan)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {loanId && (
                <>
                  <div className="mb-4">
                    <label htmlFor="paymentAmount" className="form-label">Payment Amount</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="paymentAmount" 
                      placeholder="Enter payment amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <div className="d-flex mt-2 justify-content-between">
                      <button 
                        type="button" 
                        className="action-button outline-primary btn-sm"
                        onClick={() => setAmount(activeLoans.find(loan => loan.id === loanId)?.nextPayment.toString() || '')}
                      >
                        Pay EMI Amount
                      </button>
                      <button 
                        type="button" 
                        className="action-button outline-primary btn-sm"
                        onClick={() => setAmount(activeLoans.find(loan => loan.id === loanId)?.remaining.toString() || '')}
                      >
                        Pay Full Amount
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="section-title">Select Payment Method</div>
                    <div className="payment-methods">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id}
                          className={`account-item cursor-pointer ${paymentMethod === method.id ? 'selected-item' : ''}`}
                          onClick={() => setPaymentMethod(method.id)}
                          style={{ border: paymentMethod === method.id ? '2px solid var(--wallet-primary, #3a7bd5)' : '1px solid #e0e0e0', 
                                   borderRadius: '8px', padding: '12px',
                                   backgroundColor: paymentMethod === method.id ? 'rgba(58, 123, 213, 0.05)' : 'white' }}
                        >
                          <div className="account-details">
                            <div className="">
                              <i className={`fa-solid fa-${method.icon}`}></i>
                            </div>
                            <div className="account-info">
                              <span className="account-name">{method.name}</span>
                              <span className="account-number">{method.accountNumber}</span>
                              <span className="account-number">
                                <small>Available balance: {method.balance}</small>
                              </span>
                            </div>
                          </div>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="paymentMethodSelection" 
                              checked={paymentMethod === method.id}
                              onChange={() => setPaymentMethod(method.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="transaction-list wallet-scrollbar">
              <div className="section-title">Confirm Payment</div>
              <div className="px-3 py-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div className="transaction-item border-0">
                  <div className="transaction-details">
                    <span className="fw-bold">Amount</span>
                  </div>
                  <span className="transaction-amount fw-bold">{formatCurrency(amount)}</span>
                </div>
                <div className="transaction-item border-0">
                  <div className="transaction-details">
                    <span>Loan</span>
                  </div>
                  <span>{activeLoans.find(loan => loan.id === loanId)?.name}</span>
                </div>
                <div className="transaction-item border-0">
                  <div className="transaction-details">
                    <span>Payment Method</span>
                  </div>
                  <span>{paymentMethods.find(method => method.id === paymentMethod)?.name}</span>
                </div>
                <div className="transaction-item border-0">
                  <div className="transaction-details">
                    <span>Payment Date</span>
                  </div>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="transaction-item border-0">
                  <div className="transaction-details">
                    <span>Convenience Fee</span>
                  </div>
                  <span>TZS  0.00</span>
                </div>
                <hr />
                <div className="transaction-item border-0">
                  <div className="transaction-details">
                    <span className="fw-bold">Total Amount</span>
                  </div>
                  <span className="transaction-amount fw-bold">{formatCurrency(amount)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-between mt-4">
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
              className={`action-button primary ${step === 2 ? '' : 'w-100'}`}
              disabled={
                (step === 1 && (!loanId || !amount || !paymentMethod)) || 
                isProcessing
              }
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin me-2"></i>
                  Processing...
                </>
              ) : (
                step === 1 ? 'Continue to Payment' : 'Confirm & Pay'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanPayment;