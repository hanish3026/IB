import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { accountData } from '../data/accountData';
import AccountCardsDisplay from './AccountCardsDisplay';
import '../css/Account.css';

const AccountOverview = () => {
    const { t } = useTranslation('account');
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [copiedField, setCopiedField] = useState('');
    const [displayAccount, setDisplayAccount] = useState(null);

    // Memoize the callback to prevent unnecessary re-renders
    const handleSetDisplayAccount = useCallback((account) => {
        setDisplayAccount(account);
    }, []);

    // Cleanup effect to prevent memory leaks and navigation issues
    useEffect(() => {
        return () => {
            // Reset state when component unmounts
            setDisplayAccount(null);
            setCopiedField('');
            setShowAccountDetails(false);
        };
    }, []);
    const formatCurrency = (amount) => {
        const absAmount = Math.abs(amount);
        return `TZS ${absAmount.toLocaleString()}`;
    };

    // Helper function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Helper function to copy to clipboard
    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(''), 2000);
        });
    };

    // Calculate account health score
    const calculateHealthScore = () => {
        const totalBalance = accountData.availableBalance || 0;
        const totalDebt = accountData.loans ? accountData.loans.reduce((acc, loan) => acc + (loan.outstandingAmount || 0), 0) : 0;
        const ratio = totalBalance / (totalBalance + totalDebt) || 1;
        return Math.round(ratio * 100);
    };

    // Get account activity data
    const getRecentActivity = () => {
        return accountData.recentTransactions ? accountData.recentTransactions.slice(0, 5) : [];
    };

    // Calculate monthly spending
    const getMonthlySpending = () => {
        if (!accountData.recentTransactions || accountData.recentTransactions.length === 0) {
            return 0;
        }
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return accountData.recentTransactions
            .filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear &&
                       transaction.amount < 0;
            })
            .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
    };

    const healthScore = calculateHealthScore();
    const recentActivity = getRecentActivity();
    const monthlySpending = getMonthlySpending();

    return (
        <div className="account-overview-container">
            {/* Header Section */}
            <div className="account-overview-header">
                <div className="account-overview-welcome">
                    <h2 className="account-overview-title">{t('welcome')}, {accountData.holderName}!</h2>
                    <p className="account-overview-subtitle">{t('todayOverview')}</p>
                </div>
                <div className="account-overview-date">
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>{new Date().toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </div>
            </div>
<AccountCardsDisplay SetDisplayAccount={handleSetDisplayAccount} />
            {/* Main Balance Card */}
            {/* <div className="account-overview-balance-hero">
                <div className="account-overview-balance-main">
                    <div className="account-overview-balance-header">
                        <div className="account-overview-balance-info">
                            <span className="account-overview-balance-label">Total Available Balance</span>
                            <div className="account-overview-balance-amount">
                                {formatCurrency(accountData.availableBalance)}
                            </div>
                        </div>
                        <div className="account-overview-balance-icon">
                            <i className="fa-solid fa-wallet"></i>
                        </div>
                    </div>
                    
                    <div className="account-overview-balance-details">
                        <div className="account-overview-balance-item">
                            <span className="account-overview-balance-item-label">Account</span>
                            <span className="account-overview-balance-item-value">****{accountData.number.slice(-4)}</span>
                        </div>
                        <div className="account-overview-balance-item">
                            <span className="account-overview-balance-item-label">Status</span>
                            <span className={`account-overview-status-badge ${accountData.status.toLowerCase()}`}>
                                <i className="fa-solid fa-circle"></i>
                                {accountData.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="account-overview-quick-actions">
                    <button className="account-overview-action-btn primary">
                        <i className="fa-solid fa-paper-plane"></i>
                        Transfer
                    </button>
                    <button className="account-overview-action-btn secondary">
                        <i className="fa-solid fa-plus"></i>
                        Add Money
                    </button>
                    <button className="account-overview-action-btn secondary">
                        <i className="fa-solid fa-file-invoice"></i>
                        Statement
                    </button>
                </div>
            </div> */}

            {/* Statistics Grid */}
            <div className="account-overview-stats-grid mt-5">
                {/* Financial Health Score */}
                {/* <div className="account-overview-stat-card health-score">
                    <div className="account-overview-stat-header">
                        <h4 className="account-overview-stat-title">Financial Health</h4>
                        <i className="fa-solid fa-heart-pulse"></i>
                    </div>
                    <div className="account-overview-health-circle">
                        <div className="account-overview-health-progress" style={{
                            background: `conic-gradient(var(--account-primary-color) ${healthScore * 3.6}deg, var(--account-primary-color) 0deg)`
                        }}>
                            <div className="account-overview-health-inner">
                                <span className="account-overview-health-score">{healthScore}%</span>
                                <span className="account-overview-health-label">Excellent</span>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Monthly Spending */}
                {/* <div className="account-overview-stat-card spending">
                    <div className="account-overview-stat-header">
                        <h4 className="account-overview-stat-title">This Month</h4>
                        <i className="fa-solid fa-chart-line"></i>
                    </div>
                    <div className="account-overview-stat-amount">
                        {formatCurrency(monthlySpending)}
                    </div>
                    <div className="account-overview-stat-subtitle">Total Spending</div>
                    <div className="account-overview-spending-bar">
                        <div className="account-overview-spending-progress" style={{
                            width: `${Math.min((monthlySpending / 100000) * 100, 100)}%`
                        }}></div>
                    </div>
                </div> */}

                {/* Savings Goal */}
                {/* <div className="account-overview-stat-card savings">
                    <div className="account-overview-stat-header">
                        <h4 className="account-overview-stat-title">Savings Goal</h4>
                        <i className="fa-solid fa-piggy-bank"></i>
                    </div>
                    <div className="account-overview-stat-amount">
                        {formatCurrency(accountData.fixedDeposits ? accountData.fixedDeposits.reduce((acc, fd) => acc + (fd.amount || 0), 0) : 0)}
                    </div>
                    <div className="account-overview-stat-subtitle">Fixed Deposits</div>
                    <div className="account-overview-goal-progress">
                        <div className="account-overview-goal-bar" style={{ width: '75%' }}></div>
                    </div>
                </div> */}

                {/* Recent Activity */}
                {/* <div className="account-overview-stat-card activity">
                    <div className="account-overview-stat-header">
                        <h4 className="account-overview-stat-title">Recent Activity</h4>
                        <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div className="account-overview-activity-list">
                        {recentActivity.map((transaction, index) => (
                            <div key={index} className="account-overview-activity-item">
                                <div className="account-overview-activity-icon">
                                    <i className={`fa-solid ${transaction.amount > 0 ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                                </div>
                                <div className="account-overview-activity-details">
                                    <span className="account-overview-activity-description">{transaction.description}</span>
                                    <span className="account-overview-activity-date">{formatDate(transaction.date)}</span>
                                </div>
                                <span className={`account-overview-activity-amount ${transaction.amount > 0 ? 'credit' : 'debit'}`}>
                                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>

            {/* Account Details Section */}
            <div className="account-overview-details-section">
                <div className="account-overview-details-header">
                    <h3 className="account-overview-details-title">{t('accountInfo')}</h3>
                    <button 
                        className="account-overview-toggle-btn"
                        onClick={() => setShowAccountDetails(!showAccountDetails)}
                    >
                        <i className={`fa-solid fa-chevron-${showAccountDetails ? 'up' : 'down'}`}></i>
                        {showAccountDetails ? t('hideDetails') : t('showDetails')}
                    </button>
                </div>

                {showAccountDetails && (
                    <div className="account-overview-details-content">
                        <div className="account-overview-details-grid">
                            <div className="account-overview-detail-card">
                                <div className="account-overview-detail-item">
                                    <span className="account-overview-detail-label">{t('accountType')}</span>
                                    <span className="account-overview-detail-value">{displayAccount?.type || accountData.type || t('savingsAccount')}</span>
                                </div>
                                <div className="account-overview-detail-item">
                                    <span className="account-overview-detail-label">{t('accountNumber')}</span>
                                    <div className="account-overview-detail-copyable">
                                        <span className="account-overview-detail-value">{displayAccount?.accountNumber || accountData.number}</span>
                                        <button 
                                            className="account-overview-copy-btn"
                                            onClick={() => copyToClipboard(displayAccount?.accountNumber || accountData.number, 'account')}
                                        >
                                            <i className={`fa-solid ${copiedField === 'account' ? 'fa-check' : 'fa-copy'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="account-overview-detail-item">
                                    <span className="account-overview-detail-label">{t('accountHolder')}</span>
                                    <span className="account-overview-detail-value">{displayAccount?.holderName || accountData.holderName}</span>
                                </div>
                            </div>

                            <div className="account-overview-detail-card">
                                <div className="account-overview-detail-item">
                                    <span className="account-overview-detail-label">{t('branch')}</span>
                                    <span className="account-overview-detail-value">{displayAccount?.branchName || accountData.branch || 'Downtown Branch'}</span>
                                </div>
                                <div className="account-overview-detail-item">
                                    <span className="account-overview-detail-label">{t('ifscCode')}</span>
                                    <div className="account-overview-detail-copyable">
                                        <span className="account-overview-detail-value">BANK0001234</span>
                                        <button 
                                            className="account-overview-copy-btn"
                                            onClick={() => copyToClipboard('BANK0001234', 'ifsc')}
                                        >
                                            <i className={`fa-solid ${copiedField === 'ifsc' ? 'fa-check' : 'fa-copy'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="account-overview-detail-item">
                                    <span className="account-overview-detail-label">{t('accountOpened')}</span>
                                    <span className="account-overview-detail-value">{formatDate('2023-01-15')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Loans and Deposits Overview */}
            <div className="account-overview-products-section">
                <h3 className="account-overview-section-title">{t('bankingProducts')}</h3>
                
                <div className="account-overview-products-grid">
                    {/* Fixed Deposits */}
                    <div className="account-overview-product-card">
                        <div className="account-overview-product-header">
                            <div className="account-overview-product-icon fd">
                                <i className="fa-solid fa-landmark"></i>
                            </div>
                            <div className="account-overview-product-info">
                                <h4 className="account-overview-product-title">{t('fixedDeposits')}</h4>
                                <span className="account-overview-product-count">{accountData.fixedDeposits ? accountData.fixedDeposits.length : 0} {t('active')}</span>
                            </div>
                        </div>
                        <div className="account-overview-product-amount">
                            {formatCurrency(accountData.fixedDeposits ? accountData.fixedDeposits.reduce((acc, fd) => acc + (fd.amount || 0), 0) : 0)}
                        </div>
                        <div className="account-overview-product-details">
                            <span>{t('nextMaturity')}: {formatDate(accountData.fixedDeposits?.[0]?.maturityDate || '2026-03-15')}</span>
                        </div>
                    </div>

                    {/* Loans */}
                    <div className="account-overview-product-card">
                        <div className="account-overview-product-header">
                            <div className="account-overview-product-icon loan">
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                            </div>
                            <div className="account-overview-product-info">
                                <h4 className="account-overview-product-title">{t('loans')}</h4>
                                <span className="account-overview-product-count">{accountData.loans ? accountData.loans.length : 0} {t('active')}</span>
                            </div>
                        </div>
                        <div className="account-overview-product-amount">
                            {formatCurrency(accountData.loans ? accountData.loans.reduce((acc, loan) => acc + (loan.outstandingAmount || 0), 0) : 0)}
                        </div>
                        <div className="account-overview-product-details">
                            <span>{t('nextEmi')}: {formatDate(accountData.loans?.[0]?.nextPaymentDate || '2025-03-15')}</span>
                        </div>
                    </div>

                    {/* Credit Cards */}
                    <div className="account-overview-product-card">
                        <div className="account-overview-product-header">
                            <div className="account-overview-product-icon card">
                                <i className="fa-solid fa-credit-card"></i>
                            </div>
                            <div className="account-overview-product-info">
                                <h4 className="account-overview-product-title">{t('creditCards')}</h4>
                                <span className="account-overview-product-count">{accountData.linkedCards ? accountData.linkedCards.filter(card => card.type === 'Credit Card').length : 0} {t('active')}</span>
                            </div>
                        </div>
                        <div className="account-overview-product-amount">
                            {formatCurrency(250000)}
                        </div>
                        <div className="account-overview-product-details">
                            <span>{t('availableLimit')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountOverview;