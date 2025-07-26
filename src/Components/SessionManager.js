import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Session timeout duration in milliseconds (10 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const PUBLIC_ROUTES = ['/', '/login'];

function SessionManager() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    let sessionTimer = null;
    
    // Function to reset the session timer
    const resetSessionTimer = () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      
      // Set new timer that will log out after SESSION_TIMEOUT
      sessionTimer = setTimeout(() => {
        // Only log out if user is on a page other than login
        if (window.location.pathname !== '/') {
          alert('Your session has timed out due to inactivity.');
          
          // Reset language to English
          i18n.changeLanguage('en');
          localStorage.setItem('language', 'en');
          document.documentElement.lang = 'en';
          
          navigate('/');
        }
      }, SESSION_TIMEOUT);
    };
    
    // Events to track for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Event handler for any user activity
    const handleUserActivity = () => {
      resetSessionTimer();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Initialize the session timer
    resetSessionTimer();
    
    // Clean up event listeners on component unmount
    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [navigate]);
  
  // This component doesn't render anything
  return null;
}

export default SessionManager;