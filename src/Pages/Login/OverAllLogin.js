import React, { useState} from 'react';
import { FaEye, FaEyeSlash, FaLock,FaRegUser  } from 'react-icons/fa';
import './OverAllLogin.css';

const OverAllLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="modern-login-container">
      <div className="animated-background">
        <div className="floating-circles">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className={`circle circle-${index + 1}`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: `${10 + index * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="glass-container">
        <div className="login-content">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-glow" />
            </div>
            <h1>Welcome Back</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <FaRegUser />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Id"
                required
                className="icon-input"
              />
              <div className="input-highlight" />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="icon-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div className="input-highlight" />
            </div>

            {/* <div className="login-options">
              <label className="custom-checkbox">
                <input type="checkbox" />
                <span className="checkmark" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div> */}

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loader">
                  <span className="loader-dot" />
                  <span className="loader-dot" />
                  <span className="loader-dot" />
                </div>
              ) : (
                'Login'
              )}
            </button>

            {/* <div className="register-prompt">
              New to our bank? 
              <Link to="/register" className="register-link">
                Create an account
              </Link>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OverAllLogin;