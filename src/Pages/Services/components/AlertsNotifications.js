import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBell, FaEnvelope, FaMobile, FaToggleOn } from "react-icons/fa";
import "../css/AlertsNotifications.css"

const AlertsNotifications = ({ closeModal }) => {
  const { t } = useTranslation("service");

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const [alerts, setAlerts] = useState({
    transactions: true,
    balance: true,
    security: true,
    offers: false,
    maintenance: true
  });

  const handleChannelChange = (channel) => {
    setNotifications(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const handleAlertChange = (type) => {
    setAlerts(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="alerts-container">
      <div className="alerts-card">
        <div className="alerts-header">
          <FaBell className="header-icon" />
          <h4>{t("notificationsCenter")}</h4>
        </div>

        <div className="notification-channels">
          <h5>{t("notificationChannels")}</h5>
          <div className="channel-options">
            <div className={`channel-item ${notifications.email ? 'active' : ''}`}
                 onClick={() => handleChannelChange('email')}>
              <FaEnvelope />
              <span>{t("email")}</span>
            </div>
            <div className={`channel-item ${notifications.sms ? 'active' : ''}`}
                 onClick={() => handleChannelChange('sms')}>
              <FaMobile />
              <span>{t("sms")}</span>
            </div>
            <div className={`channel-item ${notifications.push ? 'active' : ''}`}
                 onClick={() => handleChannelChange('push')}>
              <FaBell />
              <span>{t("push")}</span>
            </div>
          </div>
        </div>

        <div className="alert-preferences">
          <h5>{t("alertPreferences")}</h5>
          {Object.entries(alerts).map(([key, value]) => (
            <div key={key} className="alert-toggle">
              <div className="alert-info">
                <span className="alert-type">{t(key)}</span>
                <span className="alert-description">
                  {t(`${key}Desc`)}
                </span>
              </div>
              <div className={`toggle-switch ${value ? 'active' : ''}`}
                   onClick={() => handleAlertChange(key)}>
                <FaToggleOn />
              </div>
            </div>
          ))}
        </div>

        <div className="alerts-actions">
          <button className="btn-save">{t("saveChanges")}</button>
          <button className="btn btn-secondary mx-2" onClick={closeModal}>{t("cancel")}</button>
        </div>
      </div>
    </div>
  );
};

export default AlertsNotifications;