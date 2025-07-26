import React, { useState } from 'react';
import LoanOverview from '../components/LoanOverview';
import LoanPayment from '../components/LoanPayment';
import ApplyForLoan from '../components/ApplyForLoan';
import LoanEmiCalculator from '../components/LoanCalculator';
import { useTranslation } from 'react-i18next';
const Loan = () => {
  const { t } = useTranslation('loan');
  const [selectedModule, setSelectedModule] = useState('');

  const renderSelectedModule = () => {
    switch (selectedModule) {
      case '':
        return <LoanOverview setSelectedModule={setSelectedModule} />;
      case 'payment':
        return <LoanPayment />;
      case 'apply':
        return <ApplyForLoan />;
      case 'calculator':
        return <LoanEmiCalculator />;
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
                Loan Services
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-between">
                {t('loanServices')}
              <button className="action-button primary" onClick={() => {
                setSelectedModule("apply");
              }}>
                <i className="fa-solid fa-plus"></i> {t('applyForLoan')}
              </button> 
              </div>
            )}
          </h2>
        </div>
      </div>
      {renderSelectedModule()}
    </div>
  );
};

export default Loan;