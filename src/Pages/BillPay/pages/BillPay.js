import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BillPayDashboard from '../components/BillPayDashboard';
import BillPayCategory from '../components/BillPayCategory';
import BillPayForm from '../components/BillPayForm';
import BillPaySuccess from '../components/BillPaySuccess';
import '../css/BillPay.css';

const BillPay = () => {
  const { t } = useTranslation('billpay');
  const [currentStep, setCurrentStep] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep('category');
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setCurrentStep('form');
  };

  const handlePaymentSubmit = (details) => {
    setPaymentDetails(details);
    setCurrentStep('success');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
    setSelectedCategory(null);
    setSelectedProvider(null);
    setPaymentDetails(null);
  };

  const handleBackToCategory = () => {
    setCurrentStep('category');
    setSelectedProvider(null);
    setPaymentDetails(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'dashboard':
        return <BillPayDashboard onSelectCategory={handleCategorySelect} />;
      case 'category':
        return (
          <BillPayCategory 
            category={selectedCategory} 
            onSelectProvider={handleProviderSelect}
            onBack={handleBackToDashboard}
          />
        );
      case 'form':
        return (
          <BillPayForm 
            category={selectedCategory}
            provider={selectedProvider}
            onSubmit={handlePaymentSubmit}
            onBack={handleBackToCategory}
          />
        );
      case 'success':
        return (
          <BillPaySuccess 
            category={selectedCategory}
            provider={selectedProvider}
            paymentDetails={paymentDetails}
            onStartNew={handleBackToDashboard}
          />
        );
      default:
        return <BillPayDashboard onSelectCategory={handleCategorySelect} />;
    }
  };

  return (
    <div className="billpay-container">
      <div className="billpay-header">
        <h1>{t('billPayment')}</h1>
        {currentStep !== 'dashboard' && (
          <div className="billpay-breadcrumb">
            <span 
              className="breadcrumb-item clickable" 
              onClick={handleBackToDashboard}
            >
              {t('dashboard')}
            </span>
            {currentStep !== 'dashboard' && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span 
                  className={`breadcrumb-item ${currentStep === 'category' ? '' : 'clickable'}`}
                  onClick={currentStep !== 'category' ? handleBackToCategory : undefined}
                >
                  {selectedCategory?.name}
                </span>
              </>
            )}
            {currentStep === 'form' && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-item">
                  {selectedProvider?.name}
                </span>
              </>
            )}
            {currentStep === 'success' && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-item">
                  {t('paymentConfirmation')}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="billpay-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default BillPay;