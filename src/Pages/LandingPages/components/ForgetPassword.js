import React, { useState, useEffect } from "react";
import Assets from "../../../Asset/Assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../Login/Login.css"; // Reusing the same CSS styles
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function ForgetPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Validation state
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const nav = useNavigate();

  // Timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Validation functions
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      return "Email is required";
    } else if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateOTP = (value) => {
    if (!value.trim()) {
      return "OTP is required";
    } else if (value.length !== 6) {
      return "OTP must be 6 digits";
    } else if (!/^\d+$/.test(value)) {
      return "OTP must contain only numbers";
    }
    return "";
  };

  const validateNewPassword = (value) => {
    if (!value) {
      return "New password is required";
    } else if (value.length < 8) {
      return "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      return "Please confirm your password";
    } else if (value !== newPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  // Handle input changes with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({
      ...prev,
      email: validateEmail(value)
    }));
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setOtp(value);
    setErrors(prev => ({
      ...prev,
      otp: validateOTP(value)
    }));
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setErrors(prev => ({
      ...prev,
      newPassword: validateNewPassword(value),
      confirmPassword: confirmPassword ? validateConfirmPassword(confirmPassword) : ""
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors(prev => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value)
    }));
  };

  // Handle form submissions
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const emailError = validateEmail(email);
    setErrors(prev => ({ ...prev, email: emailError }));

    if (emailError) return;

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep(2);
      setResendTimer(30);
      setSuccessMessage("OTP sent successfully to your email!");
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to send OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const otpError = validateOTP(otp);
    setErrors(prev => ({ ...prev, otp: otpError }));

    if (otpError) return;

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep(3);
      setSuccessMessage("OTP verified successfully!");
      setLoading(false);
    } catch (error) {
      setErrorMessage("Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const newPasswordError = validateNewPassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);
    
    setErrors(prev => ({
      ...prev,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError
    }));

    if (newPasswordError || confirmPasswordError) return;

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage("Password reset successfully!");
      setTimeout(() => {
        nav("/login");
      }, 2000);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResendTimer(30);
      setSuccessMessage("OTP resent successfully!");
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to resend OTP. Please try again.");
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="login-form-container">
            {(errorMessage || successMessage) && (
              <div className={`login-error-message ${successMessage ? 'success' : ''}`}>
                <FontAwesomeIcon icon={successMessage ? "check-circle" : "exclamation-circle"} />
                <span>{errorMessage || successMessage}</span>
              </div>
            )}
            
            <form className="login-form" onSubmit={handleSendOTP}>
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={handleEmailChange}
                    className={errors.email ? "error-input" : ""}
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={errors.email || !email}
              >
                Send OTP
              </button>
            </form>
          </div>
        );

      case 2:
        return (
          <div className="login-form-container">
            {(errorMessage || successMessage) && (
              <div className={`login-error-message ${successMessage ? 'success' : ''}`}>
                <FontAwesomeIcon icon={successMessage ? "check-circle" : "exclamation-circle"} />
                <span>{errorMessage || successMessage}</span>
              </div>
            )}
            
            <div className="otp-info">
              <p>We've sent a 6-digit OTP to your email:</p>
              <strong>{email}</strong>
            </div>

            <form className="login-form" onSubmit={handleVerifyOTP}>
              <div className="form-field">
                <label htmlFor="otp">Enter OTP</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={handleOTPChange}
                    className={errors.otp ? "error-input" : ""}
                    maxLength="6"
                  />
                </div>
                {errors.otp && <div className="error-message">{errors.otp}</div>}
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={errors.otp || !otp}
              >
                Verify OTP
              </button>
            </form>

            <div className="resend-section">
              <p>Didn't receive OTP?</p>
              <button 
                type="button" 
                className="register-link"
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="login-form-container">
            {(errorMessage || successMessage) && (
              <div className={`login-error-message ${successMessage ? 'success' : ''}`}>
                <FontAwesomeIcon icon={successMessage ? "check-circle" : "exclamation-circle"} />
                <span>{errorMessage || successMessage}</span>
              </div>
            )}
            
            <form className="login-form" onSubmit={handleResetPassword}>
              <div className="form-field">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    className={errors.newPassword ? "error-input" : ""}
                  />
                  <button 
                    type="button" 
                    className="icon-button" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={errors.confirmPassword ? "error-input" : ""}
                  />
                  <button 
                    type="button" 
                    className="icon-button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={errors.newPassword || errors.confirmPassword || !newPassword || !confirmPassword}
              >
                Reset Password
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Forgot Password";
      case 2: return "Verify OTP";
      case 3: return "Reset Password";
      default: return "Forgot Password";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return "Enter your email to receive reset instructions";
      case 2: return "Enter the OTP sent to your email";
      case 3: return "Create a new secure password";
      default: return "Enter your email to receive reset instructions";
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Section - Animation Background */}
        <div className="login-background">
          <div className="animated-bg"></div>
          <div className="welcome-content">
            <img src={Assets.laptops} alt="Security" className="hero-image" />
            <h1 className="hero-title">Secure Password Reset</h1>
            <p className="hero-subtitle">Your account security is our top priority</p>
            <div className="feature-list">
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <span>Encrypted Process</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <span>Quick Recovery</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-lock"></i>
                <span>Secure Verification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="login-form-section">
          <div className="login-box">
            <div className="login-header">
              <button 
                className="back-button"
                onClick={() => step > 1 ? setStep(step - 1) : nav("/login")}
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-text)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h2>{getStepTitle()}</h2>
              <p>{getStepSubtitle()}</p>
            </div>

            {/* Progress indicator */}
            <div className="progress-indicator" style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
              gap: '1rem'
            }}>
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: step >= stepNumber ? 'var(--third-colour)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--primary-text)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {stepNumber}
                </div>
              ))}
            </div>

            {renderStepContent()}

            <div className="register-prompt">
              <p>Remember your password?</p>
              <button className="register-link" onClick={() => nav("/login")}>
                Back to Login
              </button>
            </div>

            <div className="security-footer">
              <div className="login-security-badge">
                <img src={Assets.Security} alt="Security Badge" />
                <p>Bank-grade security</p>
              </div>
              <div className="footer-links">
                <a href="/">Terms</a>
                <a href="/">Privacy</a>
                <a href="/">Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="layout-loader">
          <ScaleLoader color="#0056b3" />
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
