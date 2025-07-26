import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaKey } from "react-icons/fa";
import "../css/ChangePassword.css"

const ChangePassword = () => {
  const { t } = useTranslation("service");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("allFieldsRequired");
      return;
    }

    if (newPassword.length < 6) {
      setError("passwordMinLength");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("passwordsDoNotMatch");
      return;
    }

    setSuccess(true);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-header">
          <FaLock className="header-icon" />
          <h4>{t("changePassword")}</h4>
        </div>

        <div className="password-info-section">
          <div className="info-card">
            <FaShieldAlt className="info-icon" />
            <div className="info-content">
              <h6>{t("passwordSecurity")}</h6>
              <p>{t("passwordSecurityDesc")}</p>
            </div>
          </div>
          <div className="info-card">
            <FaKey className="info-icon" />
            <div className="info-content">
              <h6>{t("regularUpdates")}</h6>
              <p>{t("regularUpdatesDesc")}</p>
            </div>
          </div>
        </div>

        {error && <div className="alert-message error">{t(error)}</div>}
        {success && <div className="alert-message success">{t("passwordUpdated")}</div>}

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-section">
            <div className="form-group">
              <label>{t("currentPassword")}</label>
              <div className="password-input">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder={t("enterCurrentPassword")}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleShowPassword("current")}
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>{t("newPassword")}</label>
              <div className="password-input">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder={t("enterNewPassword")}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleShowPassword("new")}
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>{t("confirmPassword")}</label>
              <div className="password-input">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("reenterNewPassword")}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleShowPassword("confirm")}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="alerts-actions">
            <button type="submit" className="btn-save">{t("updatePassword")}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;