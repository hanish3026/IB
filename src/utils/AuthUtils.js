// Authentication utility functions

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const expiry = localStorage.getItem('tokenExpiry');
  
  if (!token || !expiry) {
    return false;
  }
  
  // Check if token has expired
  if (Date.now() > parseInt(expiry)) {
    logout();
    return false;
  }
  
  return true;
};

// Get the authentication token
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Get the user ID
export const getUserId = () => {
  return localStorage.getItem('userId');
};

// Logout function - clear all auth data
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('tokenExpiry');
};

// Refresh token expiry time
export const refreshTokenExpiry = () => {
  const newExpiry = Date.now() + (8 * 60 * 60 * 1000);
  localStorage.setItem('tokenExpiry', newExpiry);

};

// Get auth headers for API requests
export const getAuthHeaders = () => {
const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};