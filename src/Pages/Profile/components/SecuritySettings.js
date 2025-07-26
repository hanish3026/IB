import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaKey, FaMobileAlt, FaEnvelope, FaCheck, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (newPassword.length >= 8) strength += 1;
    if (newPassword.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    
    setPasswordStrength(strength);
  }, [newPassword]);

  // Password validation criteria
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  // Get strength label
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "#e0e0e0";
    if (passwordStrength <= 2) return "#f44336";
    if (passwordStrength <= 4) return "#ff9800";
    return "#4caf50";
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError('');
    setPasswordSuccess(false);
    
    // Validate current password (in a real app, this would be checked against the server)
    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    
    // Validate new password
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Simulate API call
    setLoading(true);
    
    // Mock API call with timeout
    setTimeout(() => {
      // In a real application, you would make an API call here
      // For demo purposes, we'll simulate success if current password is "password123"
      if (currentPassword === "password123") {
        setPasswordSuccess(true);
        // Clear form after successful update
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength(0);
      } else {
        setPasswordError('Current password is incorrect');
      }
      setLoading(false);
    }, 1500);
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // Add 2FA toggle logic here
  };

  return (
    <div className="profile__section">
      <div className="profile__section-header">
        <h2 className="profile__section-title">
          <FaShieldAlt className="profile__form-icon" />
          Security Settings
        </h2>
      </div>
      
      <div className="profile__form-group profile__form-group--full">
        <div className="profile__form">
          <h3 className="profile__form-label">
            <FaKey className="profile__form-icon" />
            Change Password
          </h3>
          
          {passwordSuccess && (
            <div className="profile__alert profile__alert--success">
              <FaCheck /> Password updated successfully!
            </div>
          )}
          
          {passwordError && (
            <div className="profile__alert profile__alert--error">
              <FaExclamationTriangle /> {passwordError}
            </div>
          )}
          
          <form onSubmit={handlePasswordChange}>
            <div className="profile__form-group">
              <label htmlFor="currentPassword" className="profile__form-label">Current Password</label>
              <div className="profile-password__input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  className="profile__form-input profile-password__input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  data-lpignore="true"
                  data-form-type="password"
                  required
                />
                <button
                  type="button"
                  className="profile-password__toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <small className="profile__form-hint">For demo purposes, use "password123"</small>
            </div>
            <div className="profile__form-group">
              <label htmlFor="newPassword" className="profile__form-label">New Password</label>
              <div className="profile-password__input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  className="profile__form-input profile-password__input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="password"
                  required
                />
                <button
                  type="button"
                  className="profile-password__toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {newPassword && (
                <div className="password-strength">
                  <div className="password-strength-meter">
                    <div 
                      className="password-strength-meter-fill" 
                      style={{
                        width: `${(passwordStrength / 6) * 100}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                  <div className="password-strength-label" style={{ color: getStrengthColor() }}>
                    {getStrengthLabel()}
                  </div>
                </div>
              )}
              <small className="profile__form-hint">
                Password must be at least 8 characters and include uppercase, lowercase, 
                number, and special character
              </small>
            </div>
            <div className="profile__form-group">
              <label htmlFor="confirmPassword" className="profile__form-label">Confirm New Password</label>
              <div className="profile-password__input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="profile__form-input profile-password__input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="password"
                  required
                />
                <button
                  type="button"
                  className="profile-password__toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              className="profile__btn profile__btn--primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* <div className="profile__form-group profile__form-group--full">
        <h3 className="profile__form-label">
          <FaMobileAlt className="profile__form-icon" />
          Two-Factor Authentication
        </h3>
        <div className="profile__toggle">
          <span>Two-Factor Authentication is {twoFactorEnabled ? 'enabled' : 'disabled'}</span>
          <label className="profile__toggle-label">
            <input
              type="checkbox"
              className="profile__toggle-input"
              checked={twoFactorEnabled}
              onChange={toggleTwoFactor}
            />
            <span className="profile__toggle-track">
              <span className="profile__toggle-thumb"></span>
            </span>
          </label>
        </div>
        <p className="profile__form-hint">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
      </div> */}

      {/* <div className="profile__form-group profile__form-group--full">
        <h3 className="profile__form-label">
          <FaEnvelope className="profile__form-icon" />
          Email Notifications
        </h3>
        <p className="profile__form-hint">Manage your security-related email notifications.</p>
        <button className="profile__btn profile__btn--secondary">
          Manage Email Preferences
        </button>
      </div> */}
    </div>
  );
};

export default SecuritySettings;