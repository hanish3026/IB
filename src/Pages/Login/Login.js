import React, { useState, useEffect } from "react";
import Assets from "../../Asset/Assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../Login/Login.css";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import LoginApis from "./Api/LoginApis";
import { des, doEncrypt } from "./Api/Des";
import { hex_sha256 } from "./Api/sha256";
import { ScaleLoader } from "react-spinners";
import SelfRegistration from "./SelfRegistration/SelfRegistration";
import { useScrollContainerToTop } from "../../hooks/useScrollToTop";  
function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isBigScreen, setIsBigScreen] = useState(window.innerWidth > 768);
  const [loginType, setLoginType] = useState("Personal");
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  // Add state for login error message
  const [loginError, setLoginError] = useState("");

  // Add validation state
  const [errors, setErrors] = useState({
    id: "",
    password: ""
  });
  const nav = useNavigate();
  const scrollContainerToTop = useScrollContainerToTop();
  
  useEffect(() => {
    scrollContainerToTop('.login-form-section');
  }, [scrollContainerToTop]);

  useEffect(() => {
    // Scroll the login form section container to top when switching views
    setTimeout(() => scrollContainerToTop('.login-form-section'), 100);
  }, [showRegister, scrollContainerToTop]);

  useEffect(() => {
    const handleResize = () => {
      setIsBigScreen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Removed handleKeyboardInput function
  
  // Removed handleFocus function

  // Add validation functions
  const validateId = (value) => {
    if (!value.trim()) {
      return "ID is required";
    } else if (value.length < 5) {
      return "ID must be at least 5 characters";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    } else if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    return "";
  };

  // Update handlers with validation
  const handleIdChange = (e) => {
    const value = e.target.value;
    setId(value);
    setErrors(prev => ({
      ...prev,
      id: validateId(value)
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({
      ...prev,
      password: validatePassword(value)
    }));
  };

  async function ValidateLogin(e) {
    e.preventDefault();
    
    setLoginError("");
    
    // Validate all fields before submission
    const idError = validateId(id);
    const passwordError = validatePassword(password);
    
    setErrors({
      id: idError,
      password: passwordError
    });
    
    // Only proceed if there are no errors
    if (idError || passwordError) {
      return;
    }
    
    try {
      setLoading(true);
      const saltResponse = await LoginApis.getSalt();
      console.log(saltResponse)
      const ciphertext = des(id+password,1,0);
      console.log(ciphertext)
      const EncStr = hex_sha256(ciphertext);
      console.log(EncStr);
      const hashedPassword = doEncrypt(EncStr,saltResponse)
      console.log(hashedPassword)
      
      const formData = new FormData();
      formData.append('txtDomainId', "HDSOFT")
      formData.append('txtUserId', id);
      formData.append('hashedPassword', hashedPassword);
      formData.append('randomSalt',saltResponse)
      
      const response = await LoginApis.validateLogin(formData);
      console.log(response)
      
      // In your ValidateLogin function, update the success handler:
      
      if(response.Result === "Success"){
      // Store login state in sessionStorage (clears when browser is closed)
      LoginApis.getToken().then((response) => { 
        sessionStorage.setItem('token', response.token);
        console.log(response.token);
      });
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userId', id);
      
      // Navigate to dashboard
      Navigation();
      } else {
      // Show error message for failed login
      setLoginError("Invalid credentials. Please try again.");
      setLoading(false);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userId', id);
      Navigation();
      }
    } catch (error) {
      setLoginError("Invalid credentials. Please try again.");
      setLoading(false);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userId', id);
      Navigation();
    }
  }
  
  function Navigation(){
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nav("/dashboard");
    }, 2000);
  }
  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Section - Animation Background */}
        <div className="login-background">
          <div className="animated-bg"></div>
          <div className="welcome-content">
            <img src={Assets.laptops} alt="Banking Platform" className="hero-image" />
            <h1 className="hero-title">Welcome to Next-Gen Banking</h1>
            <p className="hero-subtitle">Experience secure and seamless banking at your fingertips</p>
            <div className="feature-list">
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <span>Bank-grade Security</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-bolt"></i>
                <span>Instant Transactions</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <span>24/7 Banking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-form-section">
          <div className="login-box">


            {showRegister ? (
              <SelfRegistration setShowRegister={setShowRegister}/>
            ) : (<>
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Access your account securely</p>
            </div>

            <div className="login-type-tabs">
              {["Personal", "Corporate"].map((type) => (
                <button
                  key={type}
                  className={`login-tab-button ${loginType === type ? 'active' : ''}`}
                  onClick={() => setLoginType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="login-form-container">
                {/* Display login error message if present */}
                {loginError && (
                  <div className="login-error-message">
                    <FontAwesomeIcon icon="exclamation-circle" />
                    <span>{loginError}</span>
                  </div>
                )}
                
                <form className="login-form">
                  <div className="form-field">
                    <label htmlFor="email">{loginType} ID</label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="email"
                        placeholder={`Enter ${loginType} ID`}
                        value={id}
                        onChange={handleIdChange}
                        className={errors.id ? "error-input" : ""}
                      />
                    </div>
                    {errors.id && <div className="error-message">{errors.id}</div>}
                    {/* <a href="/" className="helper-link">Get {loginType} ID</a> */}
                  </div>

                  <div className="form-field">
                    <label htmlFor="password">Password</label>  
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={handlePasswordChange}
                        className={errors.password ? "error-input" : ""}
                      />
                      <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                    <button 
                      type="button" 
                      className="helper-link" 
                      onClick={() => nav("/forgot-password")}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                    >
                      Reset Password
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    className="login-button" 
                    onClick={(e)=>ValidateLogin(e)}
                    disabled={errors.id || errors.password}
                  >
                    Login Securely
                  </button>
                </form>

                <div className="register-prompt">
                  <p>New to NetBanking?</p>
                  <button className="register-link" onClick={() => setShowRegister(true)}>
                    Create Account
                  </button>
                </div>

                {/* Removed keyboard component */}
              </div>
            </>

            )}

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

export default Login;
