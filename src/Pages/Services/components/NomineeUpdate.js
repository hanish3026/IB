import React, { useState } from "react";
import { 
  FaUser, 
  FaLock, 
  FaUserShield, 
  FaInfoCircle, 
  FaIdCard,
  FaFileAlt
} from "react-icons/fa";
import "../css/NomineeUpdate.css";

const NomineeUpdate = () => {
  const [formData, setFormData] = useState({
    nomineeName: "",
    relationship: "",
    dob: "",
    contact: "",
    email: "",
    address: "",
    idType: "",
    idNumber: ""
  });
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceed = () => {
    const { nomineeName, relationship, dob, contact, idType, idNumber } = formData;
    if (nomineeName && relationship && dob && contact.length === 10 && idType && idNumber) {
      setShowOTP(true);
    } else {
      alert("Please fill all required fields correctly.");
    }
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      setRequestSubmitted(true);
    }
  };

  const relationships = [
    "Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"
  ];

  const idTypes = [
    "Aadhar Card", "PAN Card", "Passport", "Driving License"
  ];

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-header">
          <FaUserShield className="header-icon" />
          <h4>Nominee Management</h4>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <FaIdCard className="info-icon" />
            <div className="info-content">
              <h6>Valid ID Required</h6>
              <p>Nominee must have a valid government ID proof</p>
            </div>
          </div>
          <div className="info-card">
            <FaFileAlt className="info-icon" />
            <div className="info-content">
              <h6>Legal Binding</h6>
              <p>Nominee details are legally binding documents</p>
            </div>
          </div>
        </div>

        {requestSubmitted ? (
          <div className="success-section">
            <div className="success-content">
              <FaUser className="success-icon" />
              <h5>Nominee Updated Successfully</h5>
              <div className="success-details">
                <p>Nominee Name: <strong>{formData.nomineeName}</strong></p>
                <p>Relationship: <strong>{formData.relationship}</strong></p>
                <p>Reference ID: <strong>NOM{Math.random().toString(36).substr(2, 9)}</strong></p>
              </div>
              <p className="success-note">
                The nominee details have been successfully updated in our records.
              </p>
            </div>
          </div>
        ) : (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Nominee Name*</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Relationship*</label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select relationship</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth*</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Contact Number*</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={(e) => handleChange({
                    target: {
                      name: 'contact',
                      value: e.target.value.replace(/\D/g, '').slice(0, 10)
                    }
                  })}
                  placeholder="Enter 10-digit number"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
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
                <label>ID Type*</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select ID type</option>
                  {idTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>ID Number*</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="Enter ID number"
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label>Address*</label>
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
                    Confirm Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="alerts-actions">
                <button 
                  className="btn-save"
                  onClick={handleProceed}
                  disabled={!formData.nomineeName || !formData.relationship || !formData.dob || 
                           formData.contact.length !== 10 || !formData.idType || !formData.idNumber}
                >
                  Proceed to Verification
                </button>
              </div>
            )}
          </div>
        )}

        <div className="notice-section">
          <FaInfoCircle className="notice-icon" />
          <p className="paragraph">
            Please ensure all information provided is accurate. The nominee must be of legal age 
            and have valid identification documents. Changes to nominee details may take up to 48 
            hours to reflect in the system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NomineeUpdate;