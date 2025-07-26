import React, { useState } from 'react';

const LinkedBankAccount = () => {
  // Sample linked bank accounts data
  const [accounts, setAccounts] = useState([
    { id: 'BA001', name: 'Bank of America', accountNumber: '****1234', type: 'bank' },
    { id: 'BA002', name: 'Chase Bank', accountNumber: '****5678', type: 'bank' },
    { id: 'BA002', name: 'Chase Bank', accountNumber: '****5678', type: 'bank' }

  ]);
  
  const [showAddNew, setShowAddNew] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    name: '',
    accountNumber: '',
    type: 'bank'
  });

  const handleAddAccount = (e) => {
    e.preventDefault();
    const newAccount = {
      id: `BA00${accounts.length + 1}`,
      name: newAccountForm.name,
      accountNumber: `****${newAccountForm.accountNumber.slice(-4)}`,
      type: newAccountForm.type
    };
    
    setAccounts([...accounts, newAccount]);
    setShowAddNew(false);
    setNewAccountForm({ name: '', accountNumber: '', type: 'bank' });
  };

  const handleRemoveAccount = (id) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  return (
    <div className="linked-bank-accounts card mb-3">
      <div className="card-header">
        Linked Bank Accounts / Cards
      </div>
      <div className="card-body">
        {accounts.length > 0 ? (
          <div className="payment-methods">
            {accounts.map(account => (
              <div key={account.id} className="payment-method-card">
                <div className="payment-method-icon">
                  <i className={account.type === 'bank' ? 'fas fa-university' : 'fas fa-credit-card'}></i>
                </div>
                <div className="payment-method-details">
                  <div className="payment-method-name">{account.name}</div>
                  <div className="payment-method-number">{account.accountNumber}</div>
                </div>
                <div className="d-flex">
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    title="Manage account"
                  >
                    <i className="fas fa-cog"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveAccount(account.id)}
                    title="Remove account"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
            
            <div 
              className="payment-method-card add-new"
              onClick={() => setShowAddNew(true)}
            >
              <div className="payment-method-icon">
                <i className="fas fa-plus"></i>
              </div>
              <div className="payment-method-details">
                <div className="payment-method-name">Add New Account/Card</div>
                <div className="payment-method-number">Link your bank account or card</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="payment-method-icon mx-auto mb-3">
              <i className="fas fa-university"></i>
            </div>
            <p>No linked bank accounts found.</p>
            <button 
              className="btn btn-success"
              onClick={() => setShowAddNew(true)}
            >
              Link New Account/Card
            </button>
          </div>
        )}

        {showAddNew && (
          <div className="add-new-card mt-4 p-3 border rounded">
            <h6 className="mb-3">Add New Account/Card</h6>
            <form onSubmit={handleAddAccount}>
              <div className="mb-3">
                <label htmlFor="accountType" className="form-label">Account Type</label>
                <select 
                  id="accountType" 
                  className="form-select"
                  value={newAccountForm.type}
                  onChange={(e) => setNewAccountForm({...newAccountForm, type: e.target.value})}
                  required
                >
                  <option value="bank">Bank Account</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="bankName" className="form-label">Bank/Card Name</label>
                <input 
                  type="text" 
                  id="bankName" 
                  className="form-control"
                  placeholder="Enter bank or card name"
                  value={newAccountForm.name}
                  onChange={(e) => setNewAccountForm({...newAccountForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="accountNumber" className="form-label">Account/Card Number</label>
                <input 
                  type="text" 
                  id="accountNumber"
                  className="form-control"
                  placeholder="Enter account or card number"
                  value={newAccountForm.accountNumber}
                  onChange={(e) => setNewAccountForm({...newAccountForm, accountNumber: e.target.value})}
                  required
                />
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => setShowAddNew(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Link Account
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedBankAccount;