import React from 'react';
import { useTranslation } from 'react-i18next';

const TransferOverview = ({ setSelectedModule }) => {
  const { t } = useTranslation('transfer');
  
  const transferOptions = [
    {
      id: 'own',
      title: t('ownAccountTransfer'),
      description: t('transferBetweenYourAccounts'),
      icon: 'fa-solid fa-right-left'
    },
    {
      id: 'domestic',
      title: t('domesticTransfer'),
      description: t('transferBetweenYourAccounts'),
      icon: 'fa-solid fa-globe'
    },
    {
      id: 'international',
      title: t('internationalTransfer'),
      description: t('transferToOtherBankAccounts'),
      icon: 'fa-solid fa-globe'
    },
    {
      id: 'within',
      title: t('moneyTransfer'),
      description: t('transferToOtherBankAccounts'),
      icon: 'fa-solid fa-building-columns'
    },
    // {
    //   id: 'neft',
    //   title: t('neftTransfer'),
    //   description: t('nationalElectronicFundsTransfer'),
    //   icon: 'fa-solid fa-money-bill-transfer'
    // },
    {
      id: 'request',
      title: t('requestToPay'),
      description: t('requestMoneyFromFriendsAndFamily'),
      icon: 'fa-solid fa-hand-holding-dollar'
    },
    {
      id: 'schedule',
      title: t('scheduleTransfer'),
      description: t('scheduleTransferForLaterDate'),
      icon: 'fa-solid fa-calendar-alt'
    },
    // {
    //   id: 'upi',
    //   title: t('upiTransfer'),
    //   description: t('unifiedPaymentsInterface'),
    //   icon: 'fa-solid fa-mobile-screen-button'
    // },
    {
      id: 'beneficiaries',
      title: t('manageBeneficiaries'),
      description: t('addAndManageYourBeneficiaries'),
      icon: 'fa-solid fa-address-book'
    }
  ];

  return (
    <div className="row">
      {transferOptions.map(option => (
        <div key={option.id} className="col-md-4 col-lg-4 mb-4">
          <div 
            className="feature-card h-100 cursor-pointer"
          >
            <div className="feature-title">
              <i className={option.icon}></i>
            <div className="feature-title">{option.title}</div>
            </div>
            <div className="feature-description">{option.description}</div>
            <button className='action-button primary mt-3 w-100' onClick={() => setSelectedModule(option.id)}>{t('transfer')}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransferOverview;