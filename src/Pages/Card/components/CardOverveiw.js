import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "../css/CardOverview.css";
import { useNavigate } from 'react-router-dom';
const CardOverview = () => {
  const { t } = useTranslation('card');
  // Sample data (replace with dynamic card data)
  const cardData = {
    type: t('creditCard'),
    number: '**** **** **** 1234',
    holderName: 'Hanish',
    expiryDate: '12/26',
    network: 'Visa',
    status: t('active'),
    linkedAccount: {
      number: '**** 5678',
      type: t('savingsAccount'),
      balance: 45000
    },
    creditLimit: 100000,
    remainingLimit: 65000,
    recentTransactions: [
      { id: 'T001', date: '2025-03-01', merchant: 'Amazon India', amount: -2500, status: 'completed' },
      { id: 'T002', date: '2025-02-28', merchant: 'Big Bazaar', amount: -1800, status: 'completed' },
      { id: 'T003', date: '2025-02-25', merchant: 'Swiggy', amount: -750, status: 'completed' }
    ],
    upcomingPayments: [
      { id: 'UP001', date: '2025-03-15', description: t('minimumPaymentDue'), amount: -5000, status: 'upcoming' },
      { id: 'UP002', date: '2025-03-15', description: t('minimumPaymentDue'), amount: -5000, status: 'upcoming' }

    ],
    offers: [
      { id: 'O001', title: '10% Cashback on Groceries', validTill: '2025-04-30' },
      { id: 'O002', title: '5% Off on Movie Tickets', validTill: '2025-03-31' }
    ]
  };

  const nav = useNavigate();
  // State for toggle switches
  const [securitySettings, setSecuritySettings] = useState({
    onlineTransactions: true,
    internationalTransactions: false,
    contactlessPayments: true
  });

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    return `TZS  ${absAmount.toLocaleString()}`;
  };

  // Toggle handlers
  const handleToggle = (setting) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: !securitySettings[setting]
    });
  };

  // Action handlers
  function handleCardStatement() {
    
  }

  function handleRequestCard() {
    nav("/apply")
  }

  return (
    <div className="wallet-container wallet-section">
      {/* Card Overview Main Card */}
      <div className="wallet-card wallet-fade-in">
        {/* <div className="wallet-card-header">
          <h5 className="mb-0">Card Overview</h5>
        </div> */}
        <div className="wallet-card-body">
          <div className="row">
            {/* Card Information Section */}
            <div className="col-lg-6">
              <CardInformation card={cardData} t={t} />
              
              <div className="quick-actions mt-4">
                <button className="action-button primary" onClick={handleCardStatement}>
                  <i className="fa-solid fa-file-invoice"></i> {t('viewStatement')}
                </button>
                {/* <button className="action-button" onClick={handleReportCard}>
                  <i className="fa-solid fa-triangle-exclamation"></i> {t('reportCard')}
                </button> */}
                <button className="action-button" onClick={handleRequestCard}>
                  <i className="fa-solid fa-credit-card"></i> {t('requestNewCard')}
                </button>
              </div>
            </div>
            
            {/* Account Details Section */}
            <div className="col-lg-6">
              <AccountDetails 
                cardData={cardData} 
                formatCurrency={formatCurrency} 
                t={t}
              />
            </div>
          </div>
          
          {/* Transactions & Security Section */}
          <div className='mt-4'>
            <SecuritySettings 
              settings={securitySettings} 
              handleToggle={handleToggle} 
              t={t}
            />
          </div>

          {/* Additional Features */}
          <div className="row mt-4">
            <div className="col-lg-12 mb-3">
              <AdditionalFeatures offers={cardData.offers} t={t} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Card Information Component
const CardInformation = ({ card, t }) => {
  return (
    <div className="card-information wallet-fade-in-delay-1">
      <div className="section-title">{t('cardInformation')}</div>
      <div className="card-visual">
        <div className={`card-graphic ${card.network.toLowerCase()}`}>
          <div className="card-network">{card.network}</div>
          <div className="card-type">{card.type}</div>
          <div className="card-number">{card.number}</div>
          <div className="card-details">
            <div className="card-holder">
              <span className="label">{t('cardHolder')}</span>
              <span className="value">{card.holderName}</span>
            </div>
            <div className="card-expiry">
              <span className="label">{t('expires')}</span>
              <span className="value">{card.expiryDate}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-status">
        <span className="status-label">{t('status')}:</span>
        <span className={`status-value status-${card.status.toLowerCase()}`}>
          {card.status}
        </span>
        <button className="status-action">
          {card.status === t('active') ? t('temporaryLock') : t('unlockCard')}
        </button>
      </div>
    </div>
  );
};

// Account Details Component
const AccountDetails = ({ cardData, formatCurrency, t }) => {
  return (
    <div>
      <div className="section-title wallet-fade-in-delay-1">{t('accountDetails')}</div>
      <div className="account-details-container">
        <div className="account-item">
          <div className="account-details">
            <div className="">
              <i className="fa-solid fa-bank"></i>
            </div>
            <div className="account-info">
              <span className="account-name">{cardData.linkedAccount.type}</span>
              <span className="account-number">
                {t('accountNumber')}: {cardData.linkedAccount.number}
              </span>
              <span className="account-balance">
                {t('availableBalance')}: {formatCurrency(cardData.linkedAccount.balance)}
              </span>
            </div>
          </div>
          <button className="account-action">{t('details')}</button>
        </div>
        
        {cardData.type === t('creditCard') && (
          <div className="credit-limit-section mt-3">
            <div className="limit-info">
              <div className="limit-label">{t('creditLimit')}</div>
              <div className="limit-value">{formatCurrency(cardData.creditLimit)}</div>
            </div>
            <div className="limit-progress mt-2">
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${(cardData.remainingLimit / cardData.creditLimit) * 100}%` }} 
                  aria-valuenow={(cardData.remainingLimit / cardData.creditLimit) * 100} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="limit-details mt-1">
                <small>{t('availableCredit')}: {formatCurrency(cardData.remainingLimit)}</small>
                <small>{t('used')}: {formatCurrency(cardData.creditLimit - cardData.remainingLimit)}</small>
              </div>
            </div>
          </div>
        )}
        
        <button className="action-button mt-3 w-100">
          <i className="fa-solid fa-arrow-right-arrow-left"></i> {t('viewAllLinkedAccounts')}
        </button>
      </div>
    </div>
  );
};

// Transaction Details Component
const TransactionDetails = ({ transactions, upcomingPayments, formatCurrency }) => {
  return (
    <div>
      <div className="section-title wallet-fade-in-delay-2">Recent Transactions</div>
      {transactions.length > 0 ? (
        <div className="transaction-list wallet-scrollbar">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-details">
                <span className="transaction-date">{transaction.date}</span>
                <span className="transaction-description">{transaction.merchant}</span>
              </div>
              <span className="transaction-amount amount-negative">
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
          <button className="action-button mt-3 w-100">
            <i className="fa-solid fa-list"></i> View All Transactions
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <i className="fa-solid fa-receipt"></i>
          <p>No recent transactions</p>
        </div>
      )}
      {/* <div className='d-flex'>
      {upcomingPayments.length > 0 && (
        <div className="mt-4">
          <div className="section-title">Upcoming Payment</div>
          <div className="upcoming-payment">
            <div className="payment-details">
              <div className="payment-date">{upcomingPayments[0].date}</div>
              <div className="payment-description">{upcomingPayments[0].description}</div>
            </div>
            <div className="payment-amount">{formatCurrency(upcomingPayments[0].amount)}</div>
            <button className="action-button primary mt-2 w-100">Pay Now</button>
          </div>
        </div>
      )}
            {upcomingPayments.length > 0 && (
        <div className="mt-4">
          <div className="section-title">Upcoming Payment</div>
          <div className="upcoming-payment">
            <div className="payment-details">
              <div className="payment-date">{upcomingPayments[0].date}</div>
              <div className="payment-description">{upcomingPayments[0].description}</div>
            </div>
            <div className="payment-amount">{formatCurrency(upcomingPayments[0].amount)}</div>
            <button className="action-button primary mt-2 w-100">Pay Now</button>
          </div>
        </div>
      )}
      </div> */}
    </div>
  );
};

// Security Settings Component
const SecuritySettings = ({ settings, handleToggle, t }) => {
  return (
    <div>
      <div className="section-title wallet-fade-in-delay-2">{t('securitySettings')}</div>
      <div className="security-settings">
        <div className="setting-item">
          <div className="setting-info">
            <i className="fa-solid fa-globe"></i>
            <div className="setting-details">
              <div className="setting-title">{t('onlineTransactions')}</div>
              <div className="setting-description">{t('onlineTransactionsDesc')}</div>
            </div>
          </div>
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              checked={settings.onlineTransactions}
              onChange={() => handleToggle('onlineTransactions')}
            />
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <i className="fa-solid fa-plane"></i>
            <div className="setting-details">
              <div className="setting-title">{t('internationalTransactions')}</div>
              <div className="setting-description">{t('internationalTransactionsDesc')}</div>
            </div>
          </div>
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              checked={settings.internationalTransactions}
              onChange={() => handleToggle('internationalTransactions')}
            />
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <i className="fa-solid fa-wifi"></i>
            <div className="setting-details">
              <div className="setting-title">{t('contactlessPayments')}</div>
              <div className="setting-description">{t('contactlessPaymentsDesc')}</div>
            </div>
          </div>
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              checked={settings.contactlessPayments}
              onChange={() => handleToggle('contactlessPayments')}
            />
          </div>
        </div>
      </div>
      
      {/* <div className="additional-security-actions mt-3 d-flex gap-5">
        <button className="action-button w-100">
          <i className="fa-solid fa-key"></i> Set/Reset ATM PIN
        </button>
        <button className="action-button w-100">
          <i className="fa-solid fa-shield"></i> Manage Security Features
        </button>
      </div> */}
    </div>
  );
};

// Additional Features Component
const AdditionalFeatures = ({ offers, t }) => {
  return (
    <div>
      {/* <div className="section-title wallet-fade-in-delay-3">Card Offers & Benefits</div>
      {offers.length > 0 ? (
        <div className="offers-container">
          <div className="row">
            {offers.map(offer => (
              <div key={offer.id} className="col-md-6 col-lg-4 mb-3">
                <div className="offer-card">
                  <div className="offer-title">{offer.title}</div>
                  <div className="offer-validity">Valid till: {offer.validTill}</div>
                  <button className="action-button mt-2 w-100">View Details</button>
                </div>
              </div>
            ))}
          </div>
          <button className="action-button primary mt-2">
            <i className="fa-solid fa-gift"></i> View All Offers
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <i className="fa-solid fa-gift"></i>
          <p>No current offers available</p>
        </div>
      )} */}
      
      <div className="row mt-4">
        <div className="col-lg-6 mb-3">
          <div className="feature-card">
            <div className="feature-title">
              <i className="fa-solid fa-calendar-alt"></i> {t('emiConversion')}
            </div>
            <div className="feature-description">
              {t('emiConversionDesc')}
            </div>
            <button className="action-button mt-2 w-100">{t('convertToEmi')}</button>
          </div>
        </div>
        
        <div className="col-lg-6 mb-3">
          <div className="feature-card">
            <div className="feature-title">
              <i className="fa-solid fa-money-bill-wave"></i> {t('cashAdvance')}
            </div>
            <div className="feature-description">
              {t('cashAdvanceDesc')}
            </div>
            <button className="action-button mt-2 w-100">{t('requestCash')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOverview;