import React, { useState } from "react";
import { 
  FaUserCog, 
  FaLock, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPhone, 
  FaShieldAlt,
  FaIdCard
} from "react-icons/fa";
import "../css/Details.css";

const Details = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
    address: "",
    profileImage: null,
    panNumber: "",
    aadharNumber: ""
  });

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProceed = () => {
    setShowOTP(true);
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      // Handle submission
      setShowOTP(false);
      setOtp("");
    }
  };

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-header">
          <FaUserCog className="header-icon" />
          <h4>Profile Management</h4>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <FaShieldAlt className="info-icon" />
            <div className="info-content">
              <h6>Secure Updates</h6>
              <p>All profile changes require OTP verification</p>
            </div>
          </div>
          <div className="info-card">
            <FaIdCard className="info-icon" />
            <div className="info-content">
              <h6>KYC Status</h6>
              <p>Your KYC is complete and up to date</p>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeSection === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveSection('personal')}
          >
            Personal Details
          </button>
          <button 
            className={`tab-btn ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveSection('contact')}
          >
            Contact Details
          </button>
          <button 
            className={`tab-btn ${activeSection === 'kyc' ? 'active' : ''}`}
            onClick={() => setActiveSection('kyc')}
          >
            KYC Documents
          </button>
        </div>

        <div className="profile-content">
          {activeSection === 'personal' && (
            <div className="profile-section">
              <div className="image-upload-section">
                <label className="profile-image-label">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    hidden 
                  />
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="profile-preview" />
                  ) : (
                    <div className="profile-placeholder">
                      <FaUser />
                      <span>Upload Photo</span>
                    </div>
                  )}
                </label>
                <p className="upload-hint">Max file size: 5MB</p>
              </div>

              <div className="form-group">
                <label>Nickname</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="Enter preferred name"
                  className="form-input"
                />
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="contact-section">
              <div className="form-group">
                <label><FaEnvelope /> Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label><FaPhone /> Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label><FaMapMarkerAlt /> Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>
          )}

          {activeSection === 'kyc' && (
            <div className="kyc-section">
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="Enter PAN number"
                  className="form-input"
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="Enter Aadhar number"
                  className="form-input"
                  maxLength="12"
                />
              </div>
            </div>
          )}

          {showOTP ? (
            <div className="verification-section">
              <h5><FaLock /> Security Verification</h5>
              <p>Enter the OTP sent to your registered mobile number</p>
              <div className="otp-input-container">
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                />
                <button className="btn-save" onClick={handleOTPSubmit}>
                  Verify & Update
                </button>
              </div>
            </div>
          ) : (
            <div className="alerts-actions">
              <button className="btn-save" onClick={handleProceed}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;