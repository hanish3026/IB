import React, { useState } from "react";
import { FaBook, FaLock,FaCheckCircle } from "react-icons/fa";
import "../css/CheckbookRequest.css";

const CheckbookRequest = ({ closeModal }) => {
  const [checkbookSize, setCheckbookSize] = useState("50");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleProceed = () => {
    setShowOTP(true);
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      setRequestSubmitted(true);
    }
  };

  return (
    <div className="checkbook-container">
      <div className="checkbook-card">
        {/* Close Button */}
        <div className="d-flex justify-content-end">
        <button className=" btn btn-secondary w-25 mb-3" onClick={closeModal} title="Close">
            Close
        </button>
        </div>
        {/* Header */}
        <h4 className="checkbook-header">
          <FaBook className="icon" /> Request Checkbook
        </h4>

        {requestSubmitted ? (
          <div className="status-message">
            <FaCheckCircle className="success-icon" />
            <h5>Checkbook Request Submitted</h5>
            <p>Your checkbook ({checkbookSize} leaves) will be delivered within <b>3-7 working days</b> to your registered address via courier.</p>
            {/* <button className="btn btn-secondary w-100 mt-3" onClick={closeModal}>
              Close
            </button> */}
          </div>
        ) : (
          <>
            <p>Order a new checkbook and track delivery status.</p>

            {/* Checkbook Size Selection */}
            <div className="form-group">
              <label>Select Checkbook Size</label>
              <select
                className="form-control"
                value={checkbookSize}
                onChange={(e) => setCheckbookSize(e.target.value)}
              >
                <option value="25">25 Leaves</option>
                <option value="50">50 Leaves</option>
                <option value="100">100 Leaves</option>
              </select>
            </div>

            {/* OTP Verification */}
            {showOTP ? (
              <div className="otp-container">
                <label className="otp-label">
                  <FaLock className="icon" /> Enter OTP
                </label>
                <input
                  type="text"
                  className="form-control otp-input"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                />
                <button className="btn btn-primary w-100 mt-2" onClick={handleOTPSubmit}>
                  Confirm Request
                </button>
              </div>
            ) : (
              <button className="btn btn-success w-100 mt-3" onClick={handleProceed}>
                Proceed to OTP Verification
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckbookRequest;
