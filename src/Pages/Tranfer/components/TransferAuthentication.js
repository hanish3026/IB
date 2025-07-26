import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaEye, FaEyeSlash, FaMobile, FaEnvelope, FaKey } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../css/OverAllPaymentsPage.css';
import useScrollToTop from '../../../hooks/useScrollToTop';

const TransferAuthentication = ({ 
  onAuthenticate, 
  onCancel, 
  loading = false,
  verifyingAuth = false,
  renderSessionTimer
}) => {
  const { t } = useTranslation('transfer');
  
  // Authentication steps
  const [currentStep, setCurrentStep] = useState(1); // 1: Transaction Password, 2: Mobile OTP, 3: Email OTP
  const [authData, setAuthData] = useState({
    transactionPassword: '',
    mobileOTP: ['', '', '', '', '', ''],
    emailOTP: ['', '', '', '', '', '']
  });
  const onScrollTop = useScrollToTop();
  useEffect(() => {
    onScrollTop();
  }, [onScrollTop]);
  // States for each authentication method
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Timer states for OTP resend
  const [mobileResendTimer, setMobileResendTimer] = useState(0);
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [canResendMobile, setCanResendMobile] = useState(false);
  const [canResendEmail, setCanResendEmail] = useState(false);

  // Mobile OTP Timer effect
  useEffect(() => {
    let interval;
    if (mobileResendTimer > 0) {
      interval = setInterval(() => {
        setMobileResendTimer(timer => {
          if (timer <= 1) {
            setCanResendMobile(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mobileResendTimer]);

  // Email OTP Timer effect
  useEffect(() => {
    let interval;
    if (emailResendTimer > 0) {
      interval = setInterval(() => {
        setEmailResendTimer(timer => {
          if (timer <= 1) {
            setCanResendEmail(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer]);

  const handlePasswordChange = (e) => {
    setAuthData(prev => ({
      ...prev,
      transactionPassword: e.target.value
    }));
    
    if (errors.transactionPassword) {
      setErrors(prev => ({
        ...prev,
        transactionPassword: ''
      }));
    }
  };

  const handleOTPChange = (type, index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...authData[type]];
      newOTP[index] = value;
      setAuthData(prev => ({
        ...prev,
        [type]: newOTP
      }));
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`${type}-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
      
      if (errors[type]) {
        setErrors(prev => ({
          ...prev,
          [type]: ''
        }));
      }
    }
  };

  const handleOTPKeyDown = (type, index, e) => {
    if (e.key === 'Backspace' && !authData[type][index] && index > 0) {
      const prevInput = document.getElementById(`${type}-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!authData.transactionPassword) {
          newErrors.transactionPassword = t('pleaseEnterTransactionPassword');
        } else if (authData.transactionPassword.length < 4) {
          newErrors.transactionPassword = t('passwordMinLength');
        }
        break;
      case 2:
        const mobileOTP = authData.mobileOTP.join('');
        if (mobileOTP.length !== 6) {
          newErrors.mobileOTP = t('pleaseEnterCompleteMobileOtp');
        }
        break;
      case 3:
        const emailOTP = authData.emailOTP.join('');
        if (emailOTP.length !== 6) {
          newErrors.emailOTP = t('pleaseEnterCompleteEmailOtp');
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep === 1) {
      // Validate transaction password and proceed to mobile OTP
      setCurrentStep(2);
      // Start mobile OTP timer
      setMobileResendTimer(30);
      setCanResendMobile(false);
      
      // Simulate sending mobile OTP
      console.log('Sending Mobile OTP...');
      
    } else if (currentStep === 2) {
      // Validate mobile OTP and proceed to email OTP
      setCurrentStep(3);
      // Start email OTP timer
      setEmailResendTimer(30);
      setCanResendEmail(false);
      
      // Simulate sending email OTP
      console.log('Sending Email OTP...');
      
    } else if (currentStep === 3) {
      // All authentication completed
      const authResult = {
        transactionPassword: authData.transactionPassword,
        mobileOTP: authData.mobileOTP.join(''),
        emailOTP: authData.emailOTP.join('')
      };
      
      onAuthenticate(authResult);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const resendMobileOTP = () => {
    setCanResendMobile(false);
    setMobileResendTimer(30);
    setAuthData(prev => ({
      ...prev,
      mobileOTP: ['', '', '', '', '', '']
    }));
    setErrors(prev => ({
      ...prev,
      mobileOTP: ''
    }));
    console.log('Mobile OTP resent');
  };

  const resendEmailOTP = () => {
    setCanResendEmail(false);
    setEmailResendTimer(30);
    setAuthData(prev => ({
      ...prev,
      emailOTP: ['', '', '', '', '', '']
    }));
    setErrors(prev => ({
      ...prev,
      emailOTP: ''
    }));
    console.log('Email OTP resent');
  };

  const renderTransactionPassword = () => (
    <div className="auth-step">
      <div className="auth-step-header">
        <FaKey className="auth-step-icon" />
        <h3>{t('transactionAuthorizationPassword')}</h3>
        <p>{t('enterTransactionPasswordMessage')}</p>
      </div>
      
      <div className="auth-input-container">
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`auth-input ${errors.transactionPassword ? 'error' : ''}`}
            placeholder={t('enterTransactionPassword')}
            value={authData.transactionPassword}
            onChange={handlePasswordChange}
            maxLength={20}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.transactionPassword && (
          <div className="error-message">{errors.transactionPassword}</div>
        )}
      </div>
    </div>
  );

  const renderMobileOTP = () => (
    <div className="auth-step">
      <div className="auth-step-header">
        <FaMobile className="auth-step-icon" />
        <h3>{t('mobileOtpVerification')}</h3>
        <p>{t('sentOtpToMobile')}</p>
        <strong>+255 XXX XXX 1234</strong>
      </div>
      
      <div className="auth-input-container">
        <div className="otp-input-container">
          {authData.mobileOTP.map((digit, index) => (
            <input
              key={index}
              id={`mobileOTP-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange('mobileOTP', index, e.target.value)}
              onKeyDown={(e) => handleOTPKeyDown('mobileOTP', index, e)}
              className={`otp-input ${errors.mobileOTP ? 'error' : ''}`}
            />
          ))}
        </div>
        
        {errors.mobileOTP && (
          <div className="error-message">{errors.mobileOTP}</div>
        )}
        
        <div className="otp-timer">
          {!canResendMobile ? (
            <span>{t('resendMobileOtpIn')} {mobileResendTimer}{t('seconds')}</span>
          ) : (
            <button type="button" className="resend-btn" onClick={resendMobileOTP}>
              {t('resendMobileOtp')}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmailOTP = () => (
    <div className="auth-step">
      <div className="auth-step-header">
        <FaEnvelope className="auth-step-icon" />
        <h3>{t('emailOtpVerification')}</h3>
        <p>{t('sentOtpToEmail')}</p>
        <strong>user****@gmail.com</strong>
      </div>
      
      <div className="auth-input-container">
        <div className="otp-input-container">
          {authData.emailOTP.map((digit, index) => (
            <input
              key={index}
              id={`emailOTP-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange('emailOTP', index, e.target.value)}
              onKeyDown={(e) => handleOTPKeyDown('emailOTP', index, e)}
              className={`otp-input ${errors.emailOTP ? 'error' : ''}`}
            />
          ))}
        </div>
        
        {errors.emailOTP && (
          <div className="error-message">{errors.emailOTP}</div>
        )}
        
        <div className="otp-timer">
          {!canResendEmail ? (
            <span>{t('resendEmailOtpIn')} {emailResendTimer}{t('seconds')}</span>
          ) : (
            <button type="button" className="resend-btn" onClick={resendEmailOTP}>
              {t('resendEmailOtp')}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return t('step1Of3');
      case 2: return t('step2Of3');
      case 3: return t('step3Of3');
      default: return '';
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1: return t('verifyPassword');
      case 2: return t('verifyMobileOtp');
      case 3: return t('completeAuthentication');
      default: return t('continue');
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return authData.transactionPassword.length >= 4;
      case 2: return authData.mobileOTP.join('').length === 6;
      case 3: return authData.emailOTP.join('').length === 6;
      default: return false;
    }
  };

  return (
    <>
    <div className="d-flex justify-content-end align-items-end">
      {renderSessionTimer && renderSessionTimer()}
    </div>
      <div className="d-flex justify-content-center align-items-center">
      <div className="otp-auth-container">
        <div className="auth-header">
          <FaShieldAlt className="auth-main-icon" />
          <h3>{t('transferAuthentication')}</h3>
          <p className="auth-step-indicator">{getStepTitle()}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="auth-progress">
          <div className="auth-progress-bar">
            <div 
              className="auth-progress-fill" 
              style={{width: `${(currentStep / 3) * 100}%`}}
            ></div>
          </div>
        </div>
        
        {/* Render current authentication step */}
        {currentStep === 1 && renderTransactionPassword()}
        {currentStep === 2 && renderMobileOTP()}
        {currentStep === 3 && renderEmailOTP()}
        
        <div className="auth-actions">
          <button
            type="button"
            className="auth-back-btn"
            onClick={handleBack}
            disabled={loading || verifyingAuth}
          >
            {currentStep === 1 ? t('cancel') : t('back')}
          </button>
          <button
            type="button"
            className="auth-continue-btn"
            onClick={handleStepSubmit}
            disabled={!isStepValid() || loading || verifyingAuth}
          >
            {(loading || verifyingAuth) && currentStep === 3 ? (
              <>
                <span className="spinner"></span>
                {t('authenticating')}
              </>
            ) : (
              getButtonText()
            )}
          </button>
        </div>
        
        <div className="auth-demo-hint">
          <small>
            {t('demoHint')}
          </small>
        </div>
      </div>
    </div>
    </>
  );
};

export default TransferAuthentication;