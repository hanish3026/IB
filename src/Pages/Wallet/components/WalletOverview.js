import React from 'react';
import '../css/wallet.css';
import { useNavigate } from 'react-router-dom';

const WalletOverview = ({setSelectedModule}) => {
  const nav = useNavigate();
  // Sample data (replace with dynamic data as needed)
  const totalBalance = 10000;
  const linkedAccounts = [
    { id: 'BA001', name: 'Bank of America', accountNumber: '****1234', icon: 'building-columns' },
    { id: 'BA002', name: 'Chase Bank', accountNumber: '****5678', icon: 'credit-card' }
  ];
  const recentTransactions = [
    { id: 'T001', date: '2025-02-25', description: 'Grocery Shopping', amount: -1500, status: 'completed' },
    { id: 'T002', date: '2025-02-24', description: 'Online Subscription', amount: -299, status: 'completed' },
    { id: 'T003', date: '2025-02-23', description: 'Salary Deposit', amount: 25000, status: 'completed' }
  ];
  const pendingTransactions = [
    { id: 'PT001', date: '2025-02-26', description: 'Bill Payment', amount: -750, status: 'pending' },
    { id: 'PT002', date: '2025-02-26', description: 'Transfer to Savings', amount: -2000, status: 'processing' }
  ];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    return `TZS  ${absAmount.toLocaleString()}`;
  };

  function handleTranfer(){
    setSelectedModule("transfer")
  }
  function handlewithdraw(){
    setSelectedModule("withdraw")
  }
function handleAddMoney(){
  setSelectedModule("addMoney")
}
  return (
    <div className="wallet-container wallet-section">
      {/* <h2 className="wallet-section-title mb-4">My Wallet</h2> */}
      {/* Total Balance Card */}
      <div className="wallet-card wallet-fade-in">
        <div className="wallet-card-header">
          <h5 className="mb-0">Wallet Overview</h5>
        </div>
        <div className="wallet-card-body">
          <div className="row">
            <div className="col-lg-6">
              <div className="balance-container wallet-fade-in-delay-1">
                <div className="balance-content">
                  <div className="balance-label">Total Balance</div>
                  <div className="balance-amount">TZS  {totalBalance.toLocaleString()}</div>
                  <div className="balance-info">Available for withdrawal and payments</div>
                  
                  <div className="quick-actions">
                    <button className="action-button primary" onClick={handleAddMoney}>
                      <i className="fa-solid fa-plus"></i> Add Money
                    </button>
                    <button className="action-button secondary" onClick={handleTranfer}>
                      <i className="fa-solid fa-arrow-right"></i> Transfer
                    </button>
                    <button className="action-button secondary" onClick={handlewithdraw}>
                      <i className="fa-solid fa-arrow-down"></i> Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              {/* Linked Bank Accounts Section */}
              <div className="section-title wallet-fade-in-delay-1">Linked Bank Accounts</div>
              {linkedAccounts.length > 0 ? (
                <div>
                  {linkedAccounts.map(account => (
                    <div key={account.id} className="account-item">
                      <div className="account-details">
                        <div className="">
                          <i className={`fa-solid fa-${account.icon}`}></i>
                        </div>
                        <div className="account-info">
                          <span className="account-name">{account.name}</span>
                          <span className="account-number">{account.accountNumber}</span>
                        </div>
                      </div>
                      <button className="account-action">Use</button>
                    </div>
                  ))}
                  <button className="action-button secondary mt-3 w-100">
                    <i className="fa-solid fa-plus"></i> Link New Account
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  {/* <i className="fa-solid fa-credit-card"></i> */}
                  <p>No linked accounts found</p>
                  <button className="action-button primary">Link Account</button>
                </div>
              )}
            </div>
          </div>
          
          {/* Transactions Section */}
          <div className="row mt-4">
            <div className="col-lg-6 mb-3">
              <div className="section-title wallet-fade-in-delay-2">Recent Transactions</div>
              {recentTransactions.length > 0 ? (
                <div className="transaction-list wallet-scrollbar">
                  {recentTransactions.map(txn => (
                    <div key={txn.id} className="transaction-item">
                      <div className="transaction-details">
                        <span className="transaction-date">{txn.date}</span>
                        <span className="transaction-description">{txn.description}</span>
                      </div>
                      <span className={`transaction-amount ${txn.amount >= 0 ? 'amount-positive' : 'amount-negative'}`}>
                        {txn.amount >= 0 ? '+' : ''}{formatCurrency(txn.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fa-solid fa-receipt"></i>
                  <p>No recent transactions</p>
                </div>
              )}
            </div>
            
            <div className="col-lg-6 mb-3">
              <div className="section-title wallet-fade-in-delay-2">Pending Transactions</div>
              {pendingTransactions.length > 0 ? (
                <div className="transaction-list wallet-scrollbar">
                  {pendingTransactions.map(txn => (
                    <div key={txn.id} className="transaction-item">
                      <div className="transaction-details">
                        <span className="transaction-date">{txn.date}</span>
                        <div>
                          <span className="transaction-description">{txn.description}</span>
                          <span className={`transaction-status status-${txn.status}`}>{txn.status}</span>
                        </div>
                      </div>
                      <span className="transaction-amount amount-negative">
                        {formatCurrency(txn.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fa-solid fa-clock"></i>
                  <p>No pending transactions</p>
                </div>
              )}
            </div>
          </div>
          <button className="action-button secondary">View History</button>
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;
