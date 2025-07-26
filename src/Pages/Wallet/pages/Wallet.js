import React, { useState } from 'react'
import WalletOverview from "../components/WalletOverview"
import AddMoney from "../components/AddMoney"
import WithdrawMoney from "../components/WithdrawMoney"
import TransactionTable from '../../DashBoard/components/TransactionTable'
import LinkedBankAccount from "../components/LinkedBankAccount"
import TransferMoney from '../components/TransferMoney'
// import "../../../styles/modules/wallet.css"

const Wallet = () => {
  const [selectedModule, setSelectedModule] = useState('');

  const renderSelectedModule = () => {
    switch (selectedModule) {
      case '':
        return <WalletOverview setSelectedModule={setSelectedModule} />;
      case 'add':
        return (
          <div className='row'>
            <div className='col-md-6'>
              <AddMoney />
            </div>
            <div className='col-md-6'>
              <LinkedBankAccount />
            </div>
          </div>
        );
      case 'withdraw':
        return (
          <div className='row'>
            <div className='col-md-6'>
              <WithdrawMoney />
            </div>
            <div className='col-md-6'>
              <LinkedBankAccount />
            </div>
          </div>
        );
      case 'transfer':
        return <TransferMoney />;
        case 'addMoney':
        return <AddMoney />;
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
                Wallet Services
              </div>
            ) : (
              'Wallet Services'
            )}
          </h2>
        </div>
      </div>
      {renderSelectedModule()}
    </div>
  );
};

export default Wallet