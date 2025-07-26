import React, { useState } from "react";
import { 
  FaCheckCircle, 
  FaLock, 
  FaBan, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaHistory
} from "react-icons/fa";
import "../css/StopChequePayment.css";

const StopChequePayment = () => {
  const [chequeNumber, setChequeNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleProceed = () => {
    if (chequeNumber.trim().length === 6 && accountNumber && amount) {
      setShowOTP(true);
    } else {
      alert("Please fill all required fields correctly.");
    }
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      setRequestSubmitted(true);
    }
  };

  const reasonOptions = [
    "Lost Cheque",
    "Stolen Cheque",
    "Payment Dispute",
    "Technical Error",
    "Other"
  ];

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-header">
          <FaBan className="header-icon" />
          <h4>Stop Cheque Payment</h4>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <FaExclamationTriangle className="info-icon" />
            <div className="info-content">
              <h6>Important Notice</h6>
              <p>Stop payment requests cannot be reversed once processed</p>
            </div>
          </div>
          <div className="info-card">
            <FaHistory className="info-icon" />
            <div className="info-content">
              <h6>Processing Time</h6>
              <p>Request will be processed within 24 hours</p>
            </div>
          </div>
        </div>

        {requestSubmitted ? (
          <div className="success-section">
            <div className="success-content">
              <FaCheckCircle className="success-icon" />
              <h5>Request Submitted Successfully</h5>
              <div className="success-details">
                <p>Cheque Number: <strong>{chequeNumber}</strong></p>
                <p>Amount: <strong>TZS  {amount}</strong></p>
                <p>Reference ID: <strong>SCP{Math.random().toString(36).substr(2, 9)}</strong></p>
              </div>
              <p className="success-note">
                Your stop payment request has been registered. Please allow up to 24 hours for processing.
              </p>
            </div>
          </div>
        ) : (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter account number"
                  maxLength="16"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Cheque Number</label>
                <input
                  type="text"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit cheque number"
                  maxLength="6"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Amount (TZS  )</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter cheque amount"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Reason for Stop Payment</label>
                <select 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select reason</option>
                  {reasonOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="confirmation-section">
              <label className="confirm-checkbox">
                <input 
                  type="checkbox" 
                  checked={isStopped} 
                  onChange={() => setIsStopped(!isStopped)} 
                />
                <span>I confirm that I want to stop payment for this cheque</span>
              </label>
            </div>

            {showOTP ? (
              <div className="verification-section">
                <h5><FaLock /> Security Verification</h5>
                <p>Enter the OTP sent to your registered mobile number</p>
                <div className="otp-input-container">
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                  />
                  <button className="btn-save" onClick={handleOTPSubmit}>
                    Confirm Stop Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="alerts-actions">
                <button 
                  className="btn-save"
                  onClick={handleProceed}
                  disabled={!isStopped || !chequeNumber || !accountNumber || !amount || !reason}
                >
                  Proceed to Verification
                </button>
              </div>
            )}
          </div>
        )}

        <div className="notice-section">
          <FaInfoCircle className="notice-icon" />
          <p className="paragraph">
            A fee of TZS  100 will be charged for processing the stop payment request. 
            The bank is not liable for payments processed before the stop payment request is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StopChequePayment;