import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TransferOverview from '../components/TransferOverview';
import OverAllPaymentsPage from '../components/OverAllPaymentsPage';
import '../css/TransferResult.css';
import BeneficiaryManagement from '../components/BeneficiaryManagement';
import RequestToPay from '../components/RequestToPay';
import TransferChart from '../components/TransferChart';
import OwnAccountTransfer from '../components/OwnAccountTransfer';
import DomesticTransfer from '../components/DomesticTransfer';
import InternationalTransfer from '../components/InternationalTransfer';
import ScheduleTransfer from '../components/ScheduleTransfer';
import useScrollToTop from '../../../hooks/useScrollToTop';
import AddPaymentMenu from '../../ADMIN/AddPaymentMenu';

const Transfer = () => {
  const { t } = useTranslation('transfer');
  const [selectedModule, setSelectedModule] = useState('');
  const [transferStatus, setTransferStatus] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const handleTransferComplete = (status, message) => {
    setTransferStatus({ status, message });
    // Reset to overview page after successful transfer
    setSelectedModule('') ;
    // Show status message for 5 seconds
    setTimeout(() => setTransferStatus(null), 5000);
  };

  const scrollToTop = useScrollToTop();
  useEffect(() => {
    scrollToTop();
  }, [selectedModule]);
  // Get the appropriate heading based on selected module 
  const getModuleHeading = () => {
    switch (selectedModule) {
      case '':
        return t('transferServices');
      case 'own':
        return t('ownAccountTransfer');
      case 'within':
        return t('moneyTransfer');
      case 'neft':
        return t('neftTransfer');
      case 'request':
        return t('requestToPay');
      case 'beneficiaries':
        return t('manageBeneficiaries');
      case 'domestic':
        return t('domesticTransfer');
      case 'international':
        return t('internationalTransfer');
      case 'schedule':
        return t('scheduleTransfer');
      default:
        return t('transferServices');
    }
  };

  const renderSelectedModule = () => {
    if (selectedModule === '') {
      return <TransferOverview setSelectedModule={setSelectedModule} />;
    } else if (['within', 'neft'].includes(selectedModule)) {
      // Render the unified payment page with the appropriate payment type
      return (
        <div className="transfer-form-container">
          {/* Use the unified OverAllPaymentsPage component */}
          <OverAllPaymentsPage 
            paymentType={selectedModule}
            onTransferComplete={handleTransferComplete}
            selectedBeneficiary={selectedBeneficiary}
            setSelectedModule={setSelectedModule}
          />
        </div>
      );
      } else if (selectedModule === 'request') {
        return <RequestToPay onRequestComplete={handleTransferComplete} setSelectedModule={setSelectedModule} />;
    } else if (selectedModule === 'own') {
      return <OwnAccountTransfer onTransferComplete={handleTransferComplete} setSelectedModule={setSelectedModule} />;
    } else if (selectedModule === 'domestic') {
      return <DomesticTransfer onTransferComplete={handleTransferComplete} setSelectedModule={setSelectedModule} />;
    } else if (selectedModule === 'international') {
      return <InternationalTransfer onTransferComplete={handleTransferComplete} setSelectedModule={setSelectedModule} />;
    } else if (selectedModule.type === 'schedule' || selectedModule === 'schedule') {
      return <ScheduleTransfer onTransferComplete={handleTransferComplete} setSelectedModule={setSelectedModule} transferType={selectedModule.transferType} transferData={selectedModule.data} />;
    } else {
      // For other modules like beneficiaries, RTGS, IMPS, etc.
      return (
        <div className="under-construction">
          {/* <h3>{t('thisFeatureComingSoon')}</h3>
          <p>{t('currentlyWorking')} {getModuleHeading()}.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => setSelectedModule('')}
          >
            {t('backToTransferServices')}
          </button> */}
          <BeneficiaryManagement />
        </div>
      );
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
                {getModuleHeading()}
              </div>
            ) : (
              t('transferServices')
              
            )}
            
          </h2>
          {selectedModule && (
            <p className="text-muted">
              <small>{t('transferServices')} &gt; {getModuleHeading()}</small>
            </p>
          )}
        </div>
      </div>

      {transferStatus && transferStatus.message && (
        <div className={`alert alert-${transferStatus.status === 'success' ? 'success' : 'danger'} mb-4`}>
          {transferStatus.message}
        </div>
      )}
{/* <AddPaymentMenu/> */}
      {renderSelectedModule()}
      {selectedModule === '' && <TransferChart />}
    </div>
  );
};

export default Transfer;