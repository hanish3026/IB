import React, { useState, useEffect, useRef } from 'react';
import '../css/AccountCardsDisplay.css';
import { useTranslation } from 'react-i18next';


const AccountCardsDisplay = ({SetDisplayAccount}) => {
    const { t } = useTranslation('account');

        // Clean account data structure
    const accountsData = [
        {
            id: 'ACC001',
            type: t('savingsAccount'),
            accountNumber: '1234567890123456',
            holderName: 'Hanish ',
            branchName: 'Downtown Branch',
            availableBalance: 45000,
            status: 'Active',
            icon: 'fa-piggy-bank',
            typeClass: 'savings'
        },
        {
            id: 'ACC002',
            type: t('currentAccount'),
            accountNumber: '2345678901234567',
            holderName: 'Hanish ',
            branchName: 'Downtown Branch',
            availableBalance: 125000,
            status: 'Active',
            icon: 'fa-building-columns',
            typeClass: 'current'
        },
        {
            id: 'ACC003',
            type: t('fixedDeposit'),
            accountNumber: '3456789012345678',
            holderName: 'Hanish ',
            branchName: 'Downtown Branch',
            availableBalance: 100000,
            status: 'Active',
            icon: 'fa-vault',
            typeClass: 'fixed-deposit'
        },
        {
            id: 'ACC004',
            type: t('salaryAccount'),
            accountNumber: '4567890123456789',
            holderName: 'Hanish ',
            branchName: 'Downtown Branch',
            availableBalance: 85000,
            status: 'Active',
            icon: 'fa-money-check-dollar',
            typeClass: 'salary'
        }
    ];

    const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
    const [copiedField, setCopiedField] = useState('');
    const isMountedRef = useRef(true);

    const currentAccount = accountsData[selectedAccountIndex];

    // Update parent component when selected account changes
    useEffect(() => {
        if (isMountedRef.current && SetDisplayAccount) {
            SetDisplayAccount(currentAccount);
        }
    }, [selectedAccountIndex, SetDisplayAccount]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return `TZS ${amount.toLocaleString()}`;
    };

    // Helper function to mask account number
    const maskAccountNumber = (accountNumber) => {
        return `****${accountNumber.slice(-4)}`;
    };

    // Helper function to copy to clipboard
    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(''), 2000);
        });
    };

    // Navigation functions
    const handlePrevAccount = () => {
        setSelectedAccountIndex(
            selectedAccountIndex === 0 ? accountsData.length - 1 : selectedAccountIndex - 1
        );
    };

    const handleNextAccount = () => {
        setSelectedAccountIndex(
            selectedAccountIndex === accountsData.length - 1 ? 0 : selectedAccountIndex + 1
        );
    };

    return (
        <div className="overAll-Account-deatils-container">
            <div className="overAll-Account-deatils-main-layout">
                
                {/* Left Side - Account Card */}
                <div className="overAll-Account-deatils-card-section">
                    <div className="overAll-Account-deatils-navigation">
                        <button 
                            className="overAll-Account-deatils-nav-btn prev"
                            onClick={handlePrevAccount}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        
                        <div className="overAll-Account-deatils-card-wrapper">
                            <div className={`overAll-Account-deatils-card ${currentAccount.typeClass}`}>
                                <div className="overAll-Account-deatils-card-header">
                                    <div className="overAll-Account-deatils-card-type">
                                        <div className="overAll-Account-deatils-type-icon">
                                            <i className={`fa-solid ${currentAccount.icon}`}></i>
                                        </div>
                                        <div className="overAll-Account-deatils-type-text">
                                            <h3 className="overAll-Account-deatils-account-type">{currentAccount.type}</h3>
                                            <p className="overAll-Account-deatils-account-subtitle">{t('primaryAccount')}</p>
                                        </div>
                                    </div>
                                    <div className="overAll-Account-deatils-status">
                                        <span className="overAll-Account-deatils-status-dot"></span>
                                        <span className="overAll-Account-deatils-status-text">{currentAccount.status}</span>
                                    </div>
                                </div>
                                
                                <div className="overAll-Account-deatils-card-body">
                                    <div className="overAll-Account-deatils-balance-section">
                                        <p className="overAll-Account-deatils-balance-label">{t('availableBalance')}</p>
                                        <h2 className="overAll-Account-deatils-balance-amount">
                                            {formatCurrency(currentAccount.availableBalance)}
                                        </h2>
                                    </div>
                                    
                                    <div className="overAll-Account-deatils-account-info">
                                        <div className="overAll-Account-deatils-info-row">
                                            <span className="overAll-Account-deatils-info-label">{t('accountNumber')}</span>
                                            <span className="overAll-Account-deatils-info-value">
                                                {maskAccountNumber(currentAccount.accountNumber)}
                                            </span>
                                        </div>
                                        <div className="overAll-Account-deatils-info-row">
                                            <span className="overAll-Account-deatils-info-label">{t('accountHolder')}</span>
                                            <span className="overAll-Account-deatils-info-value">{currentAccount.holderName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            className="overAll-Account-deatils-nav-btn next"
                            onClick={handleNextAccount}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>

                    <div className="overAll-Account-deatils-indicators">
                        {accountsData.map((account, index) => (
                            <button
                                key={account.id}
                                className={`overAll-Account-deatils-indicator ${index === selectedAccountIndex ? 'active' : ''}`}
                                onClick={() => setSelectedAccountIndex(index)}
                            >
                                <span className="overAll-Account-deatils-indicator-dot"></span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side - Account Details */}
                <div className="overAll-Account-deatils-details-section">
                    <div className="overAll-Account-deatils-details-header">
                        <h3 className="overAll-Account-deatils-details-title">{t('accountDetails')}</h3>
                        <p className="overAll-Account-deatils-details-subtitle">{t('detailedInformation')}</p>
                    </div>
                    
                    <div className="overAll-Account-deatils-details-content">
                        
                        {/* Account Number */}
                        <div className="overAll-Account-deatils-detail-item">
                            <div className="overAll-Account-deatils-detail-icon">
                                <i className="fa-solid fa-hashtag"></i>
                            </div>
                            <div className="overAll-Account-deatils-detail-content">
                                <span className="overAll-Account-deatils-detail-label">{t('accountNumber')}</span>
                                <span className="overAll-Account-deatils-detail-value">{currentAccount.accountNumber}</span>
                            </div>
                            <button 
                                className="overAll-Account-deatils-copy-btn"
                                onClick={() => copyToClipboard(currentAccount.accountNumber, 'accountNumber')}
                            >
                                <i className={`fa-solid ${copiedField === 'accountNumber' ? 'fa-check' : 'fa-copy'}`}></i>
                            </button>
                        </div>

                        {/* Branch Name */}
                        <div className="overAll-Account-deatils-detail-item">
                            <div className="overAll-Account-deatils-detail-icon">
                                <i className="fa-solid fa-building-columns"></i>
                            </div>
                            <div className="overAll-Account-deatils-detail-content">
                                <span className="overAll-Account-deatils-detail-label">{t('branchName')}</span>
                                <span className="overAll-Account-deatils-detail-value">{currentAccount.branchName}</span>
                            </div>
                            <button 
                                className="overAll-Account-deatils-copy-btn"
                                onClick={() => copyToClipboard(currentAccount.branchName, 'branchName')}
                            >
                                <i className={`fa-solid ${copiedField === 'branchName' ? 'fa-check' : 'fa-copy'}`}></i>
                            </button>
                        </div>

                        {/* Account Holder Name */}
                        <div className="overAll-Account-deatils-detail-item">
                            <div className="overAll-Account-deatils-detail-icon">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div className="overAll-Account-deatils-detail-content">
                                <span className="overAll-Account-deatils-detail-label">{t('accountHolder')}</span>
                                <span className="overAll-Account-deatils-detail-value">{currentAccount.holderName}</span>
                            </div>
                            <button 
                                className="overAll-Account-deatils-copy-btn"
                                onClick={() => copyToClipboard(currentAccount.holderName, 'holderName')}
                            >
                                <i className={`fa-solid ${copiedField === 'holderName' ? 'fa-check' : 'fa-copy'}`}></i>
                            </button>
                        </div>

                        {/* Available Balance */}
                        {/* <div className="overAll-Account-deatils-detail-item balance">
                            <div className="overAll-Account-deatils-detail-icon balance-icon">
                                <i className="fa-solid fa-wallet"></i>
                            </div>
                            <div className="overAll-Account-deatils-detail-content">
                                <span className="overAll-Account-deatils-detail-label">Available Balance</span>
                                <span className="overAll-Account-deatils-detail-value balance-value">
                                    {formatCurrency(currentAccount.availableBalance)}
                                </span>
                            </div>
                        </div> */}

                        {/* Account Status */}
                        {/* <div className="overAll-Account-deatils-detail-item status">
                            <div className="overAll-Account-deatils-detail-icon status-icon">
                                <i className="fa-solid fa-shield-check"></i>
                            </div>
                            <div className="overAll-Account-deatils-detail-content">
                                <span className="overAll-Account-deatils-detail-label">Account Status</span>
                                <span className="overAll-Account-deatils-detail-value status-value">
                                    <span className="overAll-Account-deatils-status-indicator active"></span>
                                    {currentAccount.status}
                                </span>
                            </div>
                        </div> */}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountCardsDisplay; 