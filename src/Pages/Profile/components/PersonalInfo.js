import React, { useState, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaCamera, FaPencilAlt } from 'react-icons/fa';

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: 'Hanish',
    email: 'hanish@example.com',
    phone: '+1234567890',
    dob: '1990-01-01',
    address: '123 Main St, City, Country',
    occupation: 'Software Engineer',
    profilePhoto: null
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Submit form logic would go here
      setIsEditing(false);
    }
  };

  return (
    <div className="profile__section">
      <header className="profile__section-header">
        <h2 className="profile__section-title">Personal Information</h2>
        <button 
          className="profile__btn profile__btn--secondary"
          onClick={() => setIsEditing(!isEditing)}
          type="button"
          aria-label={isEditing ? "Cancel editing" : "Edit personal information"}
        >
          {isEditing ? 'Cancel' : <><FaPencilAlt /> Edit</>}
        </button>
      </header>

      <form onSubmit={handleSubmit} className="profile__form">
        <div className="profile__photo-container">
          {formData.profilePhoto ? (
            <img 
              src={formData.profilePhoto} 
              alt="Profile" 
              className="profile__photo"
            />
          ) : (
            <div className="profile__photo-placeholder">
              <FaUser />
            </div>
          )}
          {isEditing && (
            <>
              <button 
                type="button" 
                className="profile__photo-btn"
                onClick={() => fileInputRef.current.click()}
                aria-label="Upload profile photo"
              >
                <FaCamera />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="profile__hidden-input"
                aria-label="Upload profile photo"
              />
            </>
          )}
        </div>

        <div className="profile__form-grid">
          <div className={`profile__form-group ${errors.fullName ? 'profile__form-group--error' : ''}`}>
            <label className="profile__form-label" htmlFor="fullName">
              <FaUser className="profile__form-icon" /> Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="profile__form-input"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName && (
              <p className="profile__form-error" id="fullName-error">{errors.fullName}</p>
            )}
          </div>

          <div className={`profile__form-group ${errors.email ? 'profile__form-group--error' : ''}`}>
            <label className="profile__form-label" htmlFor="email">
              <FaEnvelope className="profile__form-icon" /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="profile__form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p className="profile__form-error" id="email-error">{errors.email}</p>
            )}
          </div>

          <div className={`profile__form-group ${errors.phone ? 'profile__form-group--error' : ''}`}>
            <label className="profile__form-label" htmlFor="phone">
              <FaPhone className="profile__form-icon" /> Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="profile__form-input"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p className="profile__form-error" id="phone-error">{errors.phone}</p>
            )}
          </div>

          <div className="profile__form-group">
            <label className="profile__form-label" htmlFor="dob">
              <FaCalendar className="profile__form-icon" /> Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              className="profile__form-input"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="profile__form-group profile__form-group--full">
            <label className="profile__form-label" htmlFor="address">
              <FaMapMarkerAlt className="profile__form-icon" /> Address
            </label>
            <textarea
              id="address"
              name="address"
              className="profile__form-textarea"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
            />
          </div>
        </div>

        {isEditing && (
          <div className="profile__form-actions">
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

export default PersonalInfo;