import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const PUBLIC_PATHS = ['/', '/login'];

const SessionManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Skip session check for public pages
    if (PUBLIC_PATHS.includes(location.pathname)) {
      return;
    }
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
    const currentTime = Date.now();
    
    // If not logged in or session expired, redirect to login
    if (!isLoggedIn || (currentTime - lastActivity > SESSION_TIMEOUT)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('lastActivity');
      navigate('/login');
      return;
    }
    
    // Update last activity time
    localStorage.setItem('lastActivity', currentTime.toString());
    
    // Set up activity listeners
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };
    
    // Update activity on user interactions
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    
    // Set up interval to check session timeout
    const interval = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
      const currentTime = Date.now();
      
      if (currentTime - lastActivity > SESSION_TIMEOUT) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('lastActivity');
        navigate('/login');
      }
    }, 60000); // Check every minute
    
    return () => {
      // Clean up event listeners and interval
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
      clearInterval(interval);
    };
  }, [location, navigate]);
  
  return null;
};

export default SessionManager;