import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './css/AuthGuard.css';
import devtools from 'devtools-detect';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const PUBLIC_ROUTES = ['/', '/login','/forgot-password','/reset-password','/self-registration'];

// const SecurityAlert = ({ isOpen, onClose, type = 'detection' }) => {
//   if (!isOpen) return null;

//   if (type === 'timeout') {
//     return (
//       <div className="security-alert-overlay">
//         <div className="security-alert-modal">
//           <div className="security-alert-header">
//             <FaShieldAlt className="security-icon" />
//             <h2>Session Terminated</h2>
//           </div>
          
//           <div className="security-alert-content">
//             <FaExclamationTriangle className="warning-icon" />
//             <h3>Security Policy Violation</h3>
//             <p>
//               Your session has been terminated due to unauthorized developer tools usage.
//             </p>
            
//             <div className="security-action">
//               <p className="logout-message">
//                 <strong>Reason: Developer Tools Detected</strong>
//               </p>
//               <p className="instruction">
//                 For security compliance, your session cannot continue. You will be redirected to login.
//               </p>
//             </div>
//           </div>
          
//           <div className="security-alert-footer">
//             <div className="auto-logout-message">
//               <FaShieldAlt className="footer-icon" />
//               <span>Redirecting to login in 10 seconds...</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="security-alert-overlay">
//       <div className="security-alert-modal">
//         <div className="security-alert-header">
//           <FaShieldAlt className="security-icon" />
//           <h2>Security Alert</h2>
//         </div>
        
//         <div className="security-alert-content">
//           <FaExclamationTriangle className="warning-icon" />
//           <h3>Unauthorized Developer Tools Detected</h3>
//           <p>
//             For your security and to protect sensitive financial information, 
//             developer tools are not permitted in this banking application.
//           </p>
          
//           {/* <div className="security-reasons">
//             <h4>Security Reasons:</h4>
//             <ul>
//               <li>Prevents unauthorized access to sensitive data</li>
//               <li>Protects against potential security vulnerabilities</li>
//               <li>Maintains compliance with banking security standards</li>
//               <li>Safeguards your personal and financial information</li>
//             </ul>
//           </div>
//            */}
//           <div className="security-action">
//             <p className="logout-message">
//               <strong>Your session will be terminated for security purposes.</strong>
//             </p>
//             <p className="instruction">
//               Please close all developer tools and log in again to continue using the application.
//             </p>
//           </div>
//         </div>
        
//         <div className="security-alert-footer">
//           <button className="security-alert-btn" onClick={onClose}>
//             <FaShieldAlt />
//             Secure Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const AuthGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [alertType, setAlertType] = useState('detection'); // 'detection' or 'timeout'

  // Separate DevTools blocking function
  // const blockDevTools = () => {
  //   const threshold = 160;
    
  //   // Multiple detection methods for better accuracy
  //   const isDevToolsOpen = () => {
  //     // Method 1: devtools-detect library
  //     if (devtools.isOpen) {
  //       return true;
  //     }
      
  //     // Method 2: Window size comparison
  //     const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  //     const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
  //     // Method 3: Console detection
  //     let consoleDetected = false;
      
  //     // Console detection trick
  //     const start = performance.now();
  //     console.profile();
  //     console.profileEnd();
  //     const end = performance.now();
      
  //     if (end - start > 100) {
  //       consoleDetected = true;
  //     }
      
  //     // Method 4: Debugger detection
  //     let debuggerDetected = false;
  //     try {
  //       const before = Date.now();
  //       debugger;
  //       const after = Date.now();
  //       if (after - before > 100) {
  //         debuggerDetected = true;
  //       }
  //     } catch (e) {
  //       debuggerDetected = true;
  //     }
      
  //     // Method 5: Element detection
  //     let elementDetected = false;
  //     const element = new Image();
  //     Object.defineProperty(element, 'id', {
  //       get: function() {
  //         elementDetected = true;
  //         return 'devtools-detector';
  //       }
  //     });
  //     console.log(element);
      
  //     return widthThreshold || heightThreshold || consoleDetected || elementDetected;
  //   };

  //   // Check if devtools is open
  //   if (isDevToolsOpen()) {
  //     console.log("DevTools detected! Initiating security protocol...");
      
  //     // Step 1: Clear session data immediately
  //     handleSecurityAlertClose();
      
  //     // Step 2: Show security alert
  //     setTimeout(() => {
  //       setAlertType('timeout');
  //       setShowSecurityAlert(true);
  //       setDevToolsDetected(true);
        
  //       // Step 3: Auto redirect after 10 seconds
  //       setTimeout(() => {
  //         finalLogout();
  //       }, 10000);
  //     }, 100);
      
  //     return true; // DevTools detected
  //   }
    
  //   return false; // DevTools not detected
  // };

  // Dev tools detection with 5-second intervals
  // useEffect(() => {
  //   let detectionInterval;

  //   // Start detection only for authenticated routes
  //   if (!PUBLIC_ROUTES.includes(location.pathname)) {
  //     // Check immediately
  //     if (blockDevTools()) {
  //       return; // Exit if devtools detected
  //     }
      
  //     // Then check every 5 seconds
  //     detectionInterval = setInterval(() => {
  //       if (blockDevTools()) {
  //         clearInterval(detectionInterval); // Stop checking once detected
  //       }
  //     }, 1000); // Check every 1 second
  //   }

  //   return () => {
  //     if (detectionInterval) {
  //       clearInterval(detectionInterval);
  //     }
  //   };
  // }, [location.pathname]);

  // Handle security alert closure (only clear session data)
  const handleSecurityAlertClose = () => {
    // Clear all session data immediately
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('paymentToken');
    sessionStorage.removeItem('requestToken');
    sessionStorage.removeItem('tokenExpiry');
    
    // Clear any other banking session data
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('token') || key.includes('session') || key.includes('auth')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Reset language to English
    i18n.changeLanguage('en');
    localStorage.setItem('language', 'en');
    document.documentElement.lang = 'en';
  };

  // Final logout and redirect
  const finalLogout = () => {
    setShowSecurityAlert(false);
    
    // Redirect to login with security message
    navigate('/login', {
      state: { 
        securityMessage: 'Session terminated due to security policy violation. Please ensure developer tools are closed before logging in again.' 
      }
    });
  };

  useEffect(() => {
    // Skip auth check for public routes
    if (PUBLIC_ROUTES.includes(location.pathname)) {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('token');
      
      // Reset language to English for public routes
      i18n.changeLanguage('en');
      localStorage.setItem('language', 'en');
      document.documentElement.lang = 'en';
      return;
    }

    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    // If not logged in, redirect to login page
    if (!isLoggedIn) {
      // Reset language to English
      i18n.changeLanguage('en');
      localStorage.setItem('language', 'en');
      document.documentElement.lang = 'en';
      
      navigate('/login');
      return;
    }

    // Set up inactivity detection
    let inactivityTimer;

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        // Clear session data
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        
        // Reset language to English
        i18n.changeLanguage('en');
        localStorage.setItem('language', 'en');
        document.documentElement.lang = 'en';

        // Redirect to login with message
        navigate('/login', {
          state: { message: 'Your session has expired due to inactivity.' }
        });
      }, INACTIVITY_TIMEOUT);
    };

    // Reset timer on user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Initialize timer
    resetInactivityTimer();

    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Clean up
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [location.pathname, navigate]);

  // return (
  //   <SecurityAlert 
  //     isOpen={showSecurityAlert} 
  //     onClose={finalLogout}
  //     type={alertType}
  //   />
  // );
};

export default AuthGuard;