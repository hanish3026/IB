import React, { useState } from 'react';
import { FaCog, FaGlobe, FaBell, FaMoon, FaSun, FaLanguage } from 'react-icons/fa';

const AccountPreferences = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    language: 'en',
    timezone: 'GMT+05:30',
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save preferences logic would go here
    setIsEditing(false);
  };

  const toggleTheme = () => {
    setFormData(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  return (
    <div className="profile__section">
      <header className="profile__section-header">
        <h2 className="profile__section-title">
          {/* <FaCog className="profile__form-icon" /> */}
          Account Preferences
        </h2>
        <button 
          className="profile__btn profile__btn--secondary"
          onClick={() => setIsEditing(!isEditing)}
          type="button"
          aria-label={isEditing ? "Cancel editing" : "Edit preferences"}
        >
          {isEditing ? 'Cancel' : 'Edit Preferences'}
        </button>
      </header>

      <form onSubmit={handleSubmit} className="profile__form">
        <div className="profile__form-group">
          <label htmlFor="language" className="profile__form-label">
            <FaLanguage className="profile__form-icon" />
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="profile__form-select"
            disabled={!isEditing}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <div className="profile__form-group">
          <label htmlFor="timezone" className="profile__form-label">
            <FaGlobe className="profile__form-icon" />
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="profile__form-select"
            disabled={!isEditing}
          >
            <option value="GMT+05:30">(GMT+05:30) India Standard Time</option>
            <option value="GMT-05:00">(GMT-05:00) Eastern Time</option>
            <option value="GMT+00:00">(GMT+00:00) Greenwich Mean Time</option>
            <option value="GMT+01:00">(GMT+01:00) Central European Time</option>
          </select>
        </div>

        {/* <div className="profile__form-group">
          <div className="profile__form-label">
            {formData.theme === 'light' ? (
              <FaSun className="profile__form-icon" />
            ) : (
              <FaMoon className="profile__form-icon" />
            )}
            Theme
          </div>
          <div className="profile__toggle">
            <span>{formData.theme === 'light' ? 'Light' : 'Dark'} Mode</span>
            <label className="profile__toggle-label">
              <input
                type="checkbox"
                className="profile__toggle-input"
                checked={formData.theme === 'dark'}
                onChange={toggleTheme}
                disabled={!isEditing}
              />
              <span className="profile__toggle-track">
                <span className="profile__toggle-thumb"></span>
              </span>
            </label>
          </div>
        </div> */}

        <div className="profile__form-group">
          <div className="profile__form-label">
            <FaBell className="profile__form-icon" />
            Notifications
          </div>
          <div className="profile__form-checkbox">
            <label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Email Notifications
            </label>
          </div>
          <div className="profile__form-checkbox">
            <label>
              <input
                type="checkbox"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
                disabled={!isEditing}
              />
              SMS Notifications
            </label>
          </div>
          <div className="profile__form-checkbox">
            <label>
              <input
                type="checkbox"
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Marketing Emails
            </label>
          </div>
        </div>

        {isEditing && (
          <div className="profile__form-actions">
            <button 
              type="button" 
              className="profile__btn profile__btn--secondary mx-2"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="profile__btn profile__btn--primary"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AccountPreferences;