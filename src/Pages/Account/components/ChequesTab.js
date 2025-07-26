import React from 'react';
import { useNavigate } from 'react-router-dom';
import { accountData } from '../data/accountData';
import { useTranslation } from 'react-i18next';
const ChequesTab = () => {
    const { t } = useTranslation('account');
    const navigate = useNavigate();
    const chequeServices = accountData.chequeServices;

    const handleChequeBookRequest = () => {
        navigate("/apply");
    };

    const handleChequeServices = () => {
        navigate("/services");
    };

    return (
        <div className="account-cheques-container">
            <div className="account-row">
                <div className="account-col-md-6">
                    <div className="account-cheque-card">
                        <div className="account-service-icon">
                            <i className="fa-solid fa-money-check"></i>
                        </div>
                        <div className="account-service-details">
                            <div className="account-service-title">{t('requestChequeBook')}</div>
                            <div className="account-service-description">
                                {t('requestChequeBookDescription')}
                            </div>
                            {/* <div className="account-service-meta">
                                Last Request: {chequeServices.lastChequeBookRequest}
                            </div> */}
                            <button 
                                className="account-action-button account-primary"
                                onClick={handleChequeBookRequest}
                            >
                                {t('requestNow')}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="account-col-md-6">
                    <div className="account-cheque-card">
                        <div className="account-service-icon">
                            <i className="fa-solid fa-ban"></i>
                        </div>
                        <div className="account-service-details">
                            <div className="account-service-title">{t('stopChequePayment')}</div>
                            <div className="account-service-description">
                                {t('stopChequePaymentDescription')}
                            </div>
                            <button 
                                className="account-action-button account-primary"
                                onClick={handleChequeServices}
                            >
                                {t('stopCheque')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="account-cheque-status">
                <div className="account-section-title">{t('chequeStatus')}</div>
                {chequeServices.pendingCheques > 0 ? (
                    <div className="account-table-responsive">
                        <table className="account-cheque-table">
                            <thead>
                                <tr>
                                    <th>{t('chequeNumber')}</th>
                                    <th>{t('date')}</th>
                                    <th>{t('amount')}</th>
                                    <th>{t('status')}</th>
                                    <th>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>123456</td>
                                    <td>March 1, 2025</td>
                                    <td>TZS  25,000</td>
                                    <td>
                                        <span className="account-status-badge account-pending">Pending</span>
                                    </td>
                                    <td>
                                        <button className="account-action-button account-secondary account-sm">
                                            {t('stop')}
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>123457</td>
                                    <td>February 28, 2025</td>
                                    <td>TZS  15,000</td>
                                    <td>
                                        <span className="account-status-badge account-pending">Pending</span>
                                    </td>
                                    <td>
                                        <button className="account-action-button account-secondary account-sm">
                                            {t('stop')}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="account-empty-state">
                        <i className="fa-solid fa-check-circle"></i>
                        <p>{t('noPendingChequeTransactions')}</p>
                    </div>
                )}
            </div>
            
            <div className="account-cheque-tools">
                <div className="account-row">
                    <div className="account-col-md-6">
                        <div className="account-tool-card">
                            <div className="account-tool-icon">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <div className="account-tool-detail">
                                    <div className="account-tool-title">{t('chequeStatusInquiry')}</div>
                                <div className="account-tool-description">
                                    {t('checkTheStatusOfDepositedCheques')}
                                </div>
                                <button className="account-action-button account-secondary">
                                    {t('inquireNow')}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="account-col-md-6">
                        <div className="account-tool-card">
                            <div className="account-tool-icon">
                                <i className="fa-solid fa-history"></i>
                            </div>
                            <div className="account-tool-detail">
                                <div className="account-tool-title">{t('chequeHistory')}</div>
                                <div className="account-tool-description">
                                    {t('viewAllIssuedAndReceivedCheques')}
                                </div>
                                <button className="account-action-button account-secondary">
                                    {t('viewHistory')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChequesTab;