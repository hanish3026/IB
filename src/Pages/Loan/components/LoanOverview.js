import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../css/LoanOverview.css";

const LoanOverview = ({setSelectedModule}) => {
  const nav = useNavigate();
  const { t } = useTranslation('loan');
  
  // Sample data (replace with dynamic loan data)
  const totalOutstanding = 250000;
  const nextPayment = 12500;
  const nextPaymentDate = '2025-03-15';
  
  const activeLoans = [
    { id: 'L001', name: t('homeLoan'), remaining: 1850000, nextPayment: 12500, dueDate: '2025-03-15', progress: 35, icon: 'house' },
    { id: 'L002', name: t('personalLoan'), remaining: 85000, nextPayment: 7500, dueDate: '2025-03-20', progress: 65, icon: 'wallet' }
  ];
  
  const recentPayments = [
    { id: 'P001', date: '2025-02-25', description: t('monthlyHomeLoanEmi'), amount: -12500, status: 'completed' },
    { id: 'P002', date: '2025-01-25', description: t('monthlyHomeLoanEmi'), amount: -12500, status: 'completed' },
    { id: 'P003', date: '2025-02-20', description: t('monthlyPersonalLoanEmi'), amount: -7500, status: 'completed' }
  ];
  
  const upcomingPayments = [
    { id: 'UP001', date: '2025-03-15', description: t('monthlyHomeLoanEmi'), amount: -12500, status: 'upcoming' },
    { id: 'UP002', date: '2025-03-20', description: t('monthlyPersonalLoanEmi'), amount: -7500, status: 'upcoming' }
  ];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    return `TZS  ${absAmount.toLocaleString()}`;
  };

  function handleNewLoan() {
    nav("/apply");
  }

  function handlePayment() {
    setSelectedModule("payment");
  }

  function handleCalculator() {
    setSelectedModule("calculator");
  }

  function handleViewHistory() {
    setSelectedModule("history");
  }

  function handleViewStatements() {
    setSelectedModule("statements");
  }

  function handleLoanDetails(loanId) {
    setSelectedModule("details");
    // You can also pass the loan ID if needed
  }

  return (
    <div className="loan-overview-container">
      {/* Main Overview Section */}
      <div className="loan-row">
        <div className="loan-col-md-6">
          <div className="loan-info-section">
            <div className="loan-info-header">
              <h3 className="loan-info-title">{t('loanSummary')}</h3>
              <span className="loan-status-badge active">{t('active')}</span>
            </div>
            
            <div className="loan-info-card">
              <div className="loan-info-number">
                <span className="loan-info-label">{t('totalOutstanding')}</span>
                <span className="loan-info-value-large">TZS  {totalOutstanding.toLocaleString()}</span>
              </div>
              
              <div className="loan-info-details">
                <div className="loan-info-detail-item">
                  <span className="loan-info-label">{t('nextPayment')}</span>
                  <span className="loan-info-value">{formatCurrency(nextPayment)}</span>
                </div>
                <div className="loan-info-detail-item">
                  <span className="loan-info-label">{t('dueDate')}</span>
                  <span className="loan-info-value">{nextPaymentDate}</span>
                </div>
              </div>
              
              {/* Additional loan insights */}
              <div className="loan-insights">
                <div className="loan-insight-item">
                  <div className="loan-insight-icon">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <div className="loan-insight-content">
                    <span className="loan-insight-label">{t('totalActiveLoans')}</span>
                    <span className="loan-insight-value">{activeLoans.length}</span>
                  </div>
                </div>
                <div className="loan-insight-item">
                  <div className="loan-insight-icon">
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                  <div className="loan-insight-content">
                    <span className="loan-insight-label">{t('upcomingPayments')}</span>
                    <span className="loan-insight-value">{upcomingPayments.length}</span>
                  </div>
                </div>
                <div className="loan-insight-item">
                  <div className="loan-insight-icon">
                    <i className="fa-solid fa-piggy-bank"></i>
                  </div>
                  <div className="loan-insight-content">
                    <span className="loan-insight-label">{t('monthlyOutflow')}</span>
                    <span className="loan-insight-value">
                      {formatCurrency(activeLoans.reduce((sum, loan) => sum + loan.nextPayment, 0))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="loan-quick-actions">
                <button className="loan-action-button loan-primary" onClick={handlePayment}>
                  <i className="fa-solid fa-credit-card"></i> {t('makePayment')}
                </button>
                <button className="loan-action-button loan-secondary" onClick={handleNewLoan}>
                  <i className="fa-solid fa-plus"></i> {t('applyForLoan')}
                </button>
                <button className="loan-action-button loan-secondary" onClick={handleCalculator}>
                  <i className="fa-solid fa-calculator"></i> {t('emiCalculator')}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="loan-col-md-6">
          <div className="loan-balance-section">
            <h3 className="loan-balance-title">{t('activeLoans')}</h3>
            
            <div className="loan-balance-cards">
              {activeLoans.map(loan => (
                <div key={loan.id} className="loan-balance-card">
                  <div className="loan-balance-card-header">
                    <span className="loan-balance-card-title">{loan.name}</span>
                    <i className={`fa-solid fa-${loan.icon} loan-balance-card-icon`}></i>
                  </div>
                  <div className="loan-balance-amount">{formatCurrency(loan.remaining)}</div>
                  <div className="loan-progress-container">
                    <div className="loan-progress-bar">
                      <div 
                        className="loan-progress-fill" 
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <div className="loan-progress-info">
                      <span>{loan.progress}% {t('paid')}</span>
                    </div>
                  </div>
                  <div className="loan-balance-pending">
                    {t('next')}: {formatCurrency(loan.nextPayment)} {t('on')} {loan.dueDate}
                  </div>
                  <button 
                    className="loan-action-button loan-secondary loan-sm loan-full-width loan-mt-2"
                    onClick={() => handleLoanDetails(loan.id)}
                  >
                    {t('viewDetails')}
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              className="loan-action-button loan-secondary loan-full-width"
              onClick={handleViewStatements}
            >
              <i className="fa-solid fa-file-invoice"></i> {t('loanStatements')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment History Section */}
      <div className="loan-row loan-mt-4">
        <div className="loan-col-md-6">
          <div className="loan-summary">
            <h3 className="loan-summary-title">{t('recentPayments')}</h3>
            
            {recentPayments.length > 0 ? (
              <div className="loan-payment-list">
                {recentPayments.map(payment => (
                  <div key={payment.id} className="loan-payment-item">
                    <div className="loan-payment-details">
                      <div className="loan-payment-description">{payment.description}</div>
                      <div className="loan-payment-date">{payment.date}</div>
                      <span className="loan-payment-status paid">{t('completed')}</span>
                    </div>
                    <span className="loan-payment-amount amount-negative">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loan-empty-state">
                <i className="fa-solid fa-receipt"></i>
                <p>{t('noRecentPayments')}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="loan-col-md-6">
          <div className="loan-summary">
            <h3 className="loan-summary-title">{t('upcomingPayments')}</h3>
            
            {upcomingPayments.length > 0 ? (
              <div className="loan-payment-list">
                {upcomingPayments.map(payment => (
                  <div key={payment.id} className="loan-payment-item">
                    <div className="loan-payment-details">
                      <div className="loan-payment-description">{payment.description}</div>
                      <div className="loan-payment-date">{payment.date}</div>
                      <span className="loan-payment-status upcoming">{t('upcoming')}</span>
                    </div>
                    <span className="loan-payment-amount amount-negative">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
                
                <div className="loan-payment-actions">
                  <button className="loan-action-button loan-primary">
                    {t('payAll')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="loan-empty-state">
                <i className="fa-solid fa-calendar"></i>
                <p>{t('noUpcomingPayments')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="loan-payment-actions loan-mt-3">
        <button 
          className="loan-action-button loan-secondary"
          onClick={handleViewHistory}
        >
          <i className="fa-solid fa-history"></i> {t('viewPaymentHistory')}
        </button>
      </div>
    </div>
  );
};

export default LoanOverview;