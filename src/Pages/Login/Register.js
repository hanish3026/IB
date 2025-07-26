import React, { useState } from "react";

function Register({ setShowRegister }) {
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = () => {
    if (step === 1 && customerId) {
      // Simulate OTP sending logic
      console.log("OTP sent to registered mobile number.");
      setStep(2);
    } else if (step === 2 && otp.length === 6) {
      // Simulate OTP verification logic
      console.log("OTP Verified.");
      setStep(3);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("New password set successfully!");
    setShowRegister(false);
  };

  return (
    <div>
      <h3 className="text-center my-3">Register</h3>
      <form className="text-start">
        {step === 1 && (
          <div className="form-group my-3">
            <label htmlFor="customerId" className="loginlabel">Customer ID</label>
            <input
              type="text"
              className="form-control"
              id="customerId"
              placeholder="Enter Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            <button type="button" className="action-button w-100 mt-3" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-group my-3">
            <label htmlFor="otp" className="loginlabel">Enter OTP</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" className="btn btn-primary w-100 mt-3" onClick={handleNext}>
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="form-group my-3">
              <label htmlFor="newPassword" className="loginlabel">Set New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="Enter New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" onClick={handleRegister}>
              Register
            </button>
          </>
        )}
      </form>
      
      <button className="btn btn-link w-100 mt-3" onClick={() => setShowRegister(false)}>
        Back to Login
      </button>
    </div>
  );
}

export default Register;
