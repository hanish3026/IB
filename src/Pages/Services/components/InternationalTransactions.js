import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  FaMoneyBillWave, 
  FaLock, 
  FaGlobe, 
  FaShieldAlt, 
  FaInfoCircle,
  FaClock
} from "react-icons/fa";
import "../css/InternationalTransactions.css";

const InternationalTransactions = () => {
  const { t } = useTranslation("service");
  const [isEnabled, setIsEnabled] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("24");

  const handleToggle = () => {
    setShowOTP(true);
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      setIsEnabled(!isEnabled);
      setShowOTP(false);
      setOtp("");
    }
  };

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-header">
          <FaGlobe className="header-icon" />
          <h4>{t("internationalBankingAccess")}</h4>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <FaShieldAlt className="info-icon" />
            <div className="info-content">
              <h6>{t("secureTransactions")}</h6>
              <p>{t("secureTransactionsDesc")}</p>
            </div>
          </div>
          <div className="info-card">
            <FaMoneyBillWave className="info-icon" />
            <div className="info-content">
              <h6>{t("transactionLimits")}</h6>
              <p>{t("transactionLimitsDesc")}</p>
            </div>
          </div>
          <div className="info-card">
            <FaClock className="info-icon" />
            <div className="info-content">
              <h6>{t("processingTime")}</h6>
              <p>{t("processingTimeDesc")}</p>
            </div>
          </div>
        </div>

        <div className="control-section">
          <div className="status-card">
            <h5>{t("currentStatus")}</h5>
            <div className={`it-status-indicator ${isEnabled ? 'active' : 'inactive'}`}> 
              {isEnabled ? t("enabled") : t("disabled")}
            </div>
          </div>

          <div className="duration-selector">
            <h5>{t("enableDuration")}</h5>
            <div className="duration-options">
              <button 
                className={`duration-btn ${selectedDuration === "24" ? 'active' : ''}`}
                onClick={() => setSelectedDuration("24")}
              >
                {t("24hours")}
              </button>
              <button 
                className={`duration-btn ${selectedDuration === "48" ? 'active' : ''}`}
                onClick={() => setSelectedDuration("48")}
              >
                {t("48hours")}
              </button>
              <button 
                className={`duration-btn ${selectedDuration === "72" ? 'active' : ''}`}
                onClick={() => setSelectedDuration("72")}
              >
                {t("72hours")}
              </button>
            </div>
          </div>

          <div className="toggle-section">
            <h5>{isEnabled ? t("disableInternational") : t("enableInternational")}</h5>
            <div className="toggle-container">
              <span className={!isEnabled ? 'active-text' : ''}>{t("off")}</span>
              <label className="switch">
                <input type="checkbox" checked={isEnabled} onChange={handleToggle} />
                <span className="slider round"></span>
              </label>
              <span className={isEnabled ? 'active-text' : ''}>{t("on")}</span>
            </div>
          </div>

          {showOTP && (
            <div className="verification-section">
              <h5><FaLock /> {t("securityVerification")}</h5>
              <p>{t("enterOtpPrompt")}</p>
              <div className="otp-input-container">
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder={t("enterOtpPlaceholder")}
                />
                <button className="btn-save" onClick={handleOTPSubmit}>
                  {t("verifyAnd", { action: isEnabled ? t("disableInternational") : t("enableInternational") })}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="notice-section">
          <FaInfoCircle className="notice-icon" />
          <p className="paragraph">
            {t("internationalNotice")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InternationalTransactions;