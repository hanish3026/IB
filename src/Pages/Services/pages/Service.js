import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  FaLock,
  FaBell,
  FaMoneyBillWave,
  FaUserCog,
  FaBook,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes
} from "react-icons/fa";
import ChangePassword from "../components/ChangePassword";
import AlertsNotifications from "../components/AlertsNotifications";
import InternationalTransactions from "../components/InternationalTransactions";
// import CheckbookRequest from "../components/CheckbookRequest";
import StopChequePayment from "../components/StopChequePayment";
import NomineeUpdate from "../components/NomineeUpdate";
import BranchLocator from "../components/BranchLocator";
import Details from "../components/Details";
import ServiceOverview from "../components/ServiceOverview";
// import "../css/services.css";
// import "../../../styles/modules/services.css";
import CustomerSupport from "../components/CustomerSupports";
import useScrollToTop from "../../../hooks/useScrollToTop";

const Service = () => {
  const [selectedModule, setSelectedModule] = useState('');
  const { t } = useTranslation('service');
  const scrollToTop = useScrollToTop();
  useEffect(() => {
    scrollToTop();  
  }, [selectedModule]);
  const services = [
    {
      category: t('accountSecurity'),
      items: [
        { id: 'password', title: t('passwordManagement'), description: t('passwordManagementDescription'), icon: <FaLock /> },
        { id: 'notifications', title: t('notificationSettings'), description: t('notificationSettingsDescription'), icon: <FaBell /> },
        { id: 'international', title: t('internationalBanking'), description: t('internationalBankingDescription'), icon: <FaMoneyBillWave /> },
        { id: 'profile', title: t('profileSettings'), description: t('profileSettingsDescription'), icon: <FaUserCog /> },
      ]
    },
    {
      category: t('bankingTools'),
      items: [
        // { id: 'cheque', title: t('chequeServices'), description: t('chequeServicesDescription'), icon: <FaBook /> },
        { id: 'payment', title: t('paymentControls'), description: t('paymentControlsDescription'), icon: <FaBook /> },
        { id: 'nominee', title: t('accountNominees'), description: t('accountNomineesDescription'), icon: <FaUserCog /> },
        { id: 'location', title: t('findLocations'), description: t('findLocationsDescription'), icon: <FaMapMarkerAlt /> },
        { id: 'support', title: t('helpSupport'), description: t('helpSupportDescription'), icon: <FaPhone /> },
      ]
    }
  ];

  const renderSelectedModule = () => {
    scrollToTop();
    switch (selectedModule) {
      case '':
        return <ServiceOverview services={services} setSelectedModule={setSelectedModule} />;
      case 'password':
        return <ChangePassword />;
      case 'notifications':
        return <AlertsNotifications />;
      case 'international':
        return <InternationalTransactions />;
      case 'profile':
        return <Details />;
      // case 'cheque':
      //   return <CheckbookRequest />;
      case 'payment':
        return <StopChequePayment />;
      case 'nominee':
        return <NomineeUpdate />;
      case 'location':
        return <BranchLocator />;
        case 'support':
        return <CustomerSupport />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="section-title">
            {selectedModule ? (
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => setSelectedModule('')}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                {t('serviceCenter')}
              </div>
            ) : (
              t('serviceCenter')
            )}
          </h2>
        </div>
      </div>
      {renderSelectedModule()}
    </div>
  );
};

export default Service;