import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AccountOpening from '../components/AccountOpening';
import CheckApply from '../components/CheckApply';
import DepositAccount from '../components/DepositAccount';
import LoanApply from '../../Loan/components/ApplyForLoan';
import RequestCard from '../../Card/components/RequestCard';
import CheckStatus from '../components/CheckStatus';
import useScrollToTop from "../../../hooks/useScrollToTop";

const Apply = () => {
  const [selectedModule, setSelectedModule] = useState('');
  const { t } = useTranslation('apply');
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    scrollToTop();
  }, [selectedModule]);

  const modules = [
    {
      id: 'account',
      title: t('openNewAccount'),
      description: t('openNewAccountDescription'),
      icon: 'fa-solid fa-bank'
    },
    {
      id: 'deposit',
      title: t('fixedRecurringDeposit'),
      description: t('fixedRecurringDepositDescription'),
      icon: 'fa-solid fa-piggy-bank'
    },
    {
      id: 'loan',
      title: t('applyForLoans'),
      description: t('applyForLoansDescription'),
      icon: 'fa-solid fa-landmark'
    },
    {
      id: 'cards',
      title: t('applyForCreditDebitCards'),
      description: t('applyForCreditDebitCardsDescription'),
      icon: 'fa-solid fa-credit-card'
    },
    {
      id: 'checkbook',
      title: t('applyForCheckbook'),
      description: t('applyForCheckbookDescription'),
      icon: 'fa-solid fa-book'
    },
    {
      id: 'status',
      title: t('checkApplicationStatus'),
      description: t('checkApplicationStatusDescription'),
      icon: 'fa-solid fa-file-pen'
    },
    
  ];

  const renderSelectedModule = () => {
    switch (selectedModule) {
      case 'account':
        return <AccountOpening setModule={setSelectedModule} />;
      case 'checkbook':
        return <CheckApply setModule={setSelectedModule} />;
      case 'deposit':
        return <DepositAccount setModule={setSelectedModule} />;
        case 'loan':
          return <LoanApply setModule={setSelectedModule} />;
          case 'cards':
          return <RequestCard setModule={setSelectedModule} />;
          case 'status':
            return <CheckStatus/>;
      default:
        return (
          <div className="row">
            {modules.map(module => (
              <div key={module.id} className="col-md-4 mb-4">
                <div className="feature-card" style={{height: '100%'}}>
                  <div className="feature-title">
                    <i className={module.icon}></i> {module.title}
                  </div>
                  <div className="feature-description">
                    {module.description}
                  </div>
                  <button 
                    className="action-button primary mt-3 w-100"
                    onClick={() => setSelectedModule(module.id)}
                  >
                    {module.id === 'status' ? t('checkStatus') : t('applyNow')}
                  </button>
                </div>
              </div>
            ))}
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
                {modules.find(m => m.id === selectedModule)?.title || t('apply')}
              </div>
            ) : (
              t('applyForServices')
            )}
          </h2>
        </div>
      </div>
      {renderSelectedModule()}
    </div>
  );
};

export default Apply;