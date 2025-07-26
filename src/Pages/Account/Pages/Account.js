import React, { useState, useEffect } from 'react';
import "../css/Account.css";
import AccountOverview from '../components/AccountOverview';
import TransactionsTab from '../components/TransactionsTab';
import StatementsTab from '../components/StatementsTab';
import ChequesTab from '../components/ChequesTab';
import { sendPaymentRequest } from '../../../PaymentApi/sendPaymentRequest';
import { useTranslation } from 'react-i18next';
import TransactionTable from '../../DashBoard/components/TransactionTable';
const Account = () => {
    const { t } = useTranslation('account');
    const [activeTab, setActiveTab] = useState('overview');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };  

    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return <AccountOverview />;
            case 'transactions':
                return <TransactionTable />;
            case 'statements':
                return <StatementsTab />;
            case 'cheques':
                return <ChequesTab />;
            default:
                return <AccountOverview />;
        }
    };
    // Example: sending BILL payment from bank to bank
  
    return (
        <div className="account-container">
            <h2 className="account-section-title">{t('title')}</h2>
            
            <div className="account-main-card">
                <div className="account-tabs">
                    <button 
                        className={`account-tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => handleTabChange('overview')}
                    >
                        <i className="fa-solid fa-house"></i> {t('overview')}
                    </button>
                    <button 
                        className={`account-tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
                        onClick={() => handleTabChange('transactions')}
                    >
                        <i className="fa-solid fa-receipt"></i> {t('transactions')}
                    </button>
                    <button 
                        className={`account-tab-button ${activeTab === 'statements' ? 'active' : ''}`}
                        onClick={() => handleTabChange('statements')}
                    >
                        <i className="fa-solid fa-file-invoice"></i> {t('statements')}
                    </button>
                    <button 
                        className={`account-tab-button ${activeTab === 'cheques' ? 'active' : ''}`}
                        onClick={() => handleTabChange('cheques')}
                    >
                        <i className="fa-solid fa-money-check"></i> {t('cheques')}
                    </button>
                </div>
                
                <div className="account-content-area">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Account;