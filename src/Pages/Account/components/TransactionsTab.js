import React, { useState } from 'react';
import { accountData } from '../data/accountData';

const TransactionsTab = () => {
    const [dateFilter, setDateFilter] = useState('last30days');
    const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');

    // Helper function to format currency
    const formatCurrency = (amount) => {
        const absAmount = Math.abs(amount);
        return `TZS  ${absAmount.toLocaleString()}`;
    };

    // Filter transactions based on selected filters
    const getFilteredTransactions = () => {
        let filtered = [...accountData.recentTransactions];
        
        // Apply transaction type filter
        if (transactionTypeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === transactionTypeFilter);
        }
        
        // Apply date filter logic (simplified for demo)
        // In a real app, you'd implement actual date filtering
        
        return filtered;
    };

    return (
        <div className="account-transactions-container">
            <div className="account-filter-controls">
                <div className="account-filter-group">
                    <label>Date Range</label>
                    <select 
                        className="account-filter-select" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="last7days">Last 7 Days</option>
                        <option value="last30days">Last 30 Days</option>
                        <option value="last3months">Last 3 Months</option>
                        <option value="last6months">Last 6 Months</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                
                <div className="account-filter-group">
                    <label>Transaction Type</label>
                    <select 
                        className="account-filter-select" 
                        value={transactionTypeFilter}
                        onChange={(e) => setTransactionTypeFilter(e.target.value)}
                    >
                        <option value="all">All Transactions</option>
                        <option value="credit">Credits Only</option>
                        <option value="debit">Debits Only</option>
                    </select>
                </div>
            </div>
            
            <div className="account-transaction-list">
                {getFilteredTransactions().map(transaction => (
                    <div key={transaction.id} className="account-transaction-item">
                        <div className="account-transaction-details">
                            <div className="account-transaction-description">{transaction.description}</div>
                            <div className="account-transaction-date">{transaction.date}</div>
                            <div className="account-transaction-category">{transaction.category}</div>
                        </div>
                        <div className={`account-transaction-amount ${transaction.type === 'credit' ? 'amount-positive' : 'amount-negative'}`}>
                            {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="account-transaction-actions">
                <button className="account-action-button account-primary">
                    <i className="fa-solid fa-download"></i> Download Transactions
                </button>
                <button className="account-action-button account-secondary">
                    <i className="fa-solid fa-list"></i> View All Transactions
                </button>
            </div>
        </div>
    );
};

export default TransactionsTab;