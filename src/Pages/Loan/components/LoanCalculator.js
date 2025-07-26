import React, { useState, useEffect } from 'react';

const LoanEmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(12); // months
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Preset loan amounts
  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];
  
  // Calculate EMI, total interest and total amount
  useEffect(() => {
    const calculateEMI = () => {
      const principal = loanAmount;
      const ratePerMonth = interestRate / 12 / 100;
      const tenureInMonths = loanTenure;
      
      if (principal && ratePerMonth && tenureInMonths) {
        const emiValue = principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureInMonths) / 
                        (Math.pow(1 + ratePerMonth, tenureInMonths) - 1);
        
        setEmi(Math.round(emiValue));
        setTotalAmount(Math.round(emiValue * tenureInMonths));
        setTotalInterest(Math.round(emiValue * tenureInMonths - principal));
      }
    };
    
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  // Custom slider component
  const CustomSlider = ({ value, min, max, step, onChange }) => {
    return (
      <input
        type="range"
        className="form-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm mx-auto">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">Loan EMI Calculator</h5>
        </div>
        <div className="card-body">
          {/* Loan Amount Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <label className="form-label">Loan Amount (TZS  )</label>
              <div>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="form-control form-control-sm text-end"
                  style={{ width: "120px" }}
                />
              </div>
            </div>
            
            {/* Preset Amounts */}
            <div className="preset-amounts d-flex flex-wrap gap-2 mb-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setLoanAmount(amount)}
                  className={`preset-amount-btn ${loanAmount === amount ? 'active' : ''}`}
                >
                  TZS  {amount.toLocaleString()}
                </button>
              ))}
            </div>
            
            <CustomSlider
              value={loanAmount}
              min={10000}
              max={2000000}
              step={5000}
              onChange={setLoanAmount}
            />
          </div>
          
          {/* Interest Rate Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <label className="form-label">Interest Rate (%)</label>
              <div>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="form-control form-control-sm text-end"
                  style={{ width: "80px" }}
                  min="1"
                  max="30"
                  step="0.1"
                />
              </div>
            </div>
            <CustomSlider
              value={interestRate}
              min={1}
              max={30}
              step={0.1}
              onChange={setInterestRate}
            />
          </div>
          
          {/* Loan Tenure Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <label className="form-label">Loan Tenure (months)</label>
              <div>
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="form-control form-control-sm text-end"
                  style={{ width: "80px" }}
                  min="3"
                  max="360"
                />
              </div>
            </div>
            <CustomSlider
              value={loanTenure}
              min={3}
              max={360}
              step={1}
              onChange={setLoanTenure}
            />
          </div>
          
          {/* Results Section */}
          <div className="transaction-details rounded mt-4">
            <h6 className="mb-3">Loan Summary</h6>
            <div className="row text-center">
              <div className="col-4">
                <div className="text-muted small mb-1">Monthly EMI</div>
                <div className="fs-5 fw-semibold text-primary">TZS  {emi.toLocaleString()}</div>
              </div>
              <div className="col-4">
                <div className="text-muted small mb-1">Total Interest</div>
                <div className="fs-5 fw-semibold text-warning">TZS  {totalInterest.toLocaleString()}</div>
              </div>
              <div className="col-4">
                <div className="text-muted small mb-1">Total Amount</div>
                <div className="fs-5 fw-semibold text-success">TZS  {totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Apply Now Button */}
          <button className="btn btn-primary w-100 mt-4 py-2">
            Apply for Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanEmiCalculator;