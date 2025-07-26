import React from 'react';
import { useTranslation } from 'react-i18next';

const StatementsTab = () => {
    const { t } = useTranslation('account');
    return (
        <div className="account-statements-container">
            <div className="account-row">
                <div className="account-col-md-6">
                    <div className="account-statement-card">
                        <div className="account-statement-header">
                            <i className="fa-solid fa-download"></i>
                            <div className="account-statement-title">{t('downloadStatement')}</div>
                        </div>
                        <div className="account-statement-form">
                            <div className="account-form-group">
                                <label>{t('statementPeriod')}</label>
                                <select className="account-form-control">
                                    <option>{t('lastMonth')}</option>
                                    <option>{t('last3Months')}</option>
                                    <option>{t('last6Months')}</option>
                                    <option>{t('lastYear')}</option>
                                    <option>{t('customRange')}</option>
                                </select>
                            </div>
                            <button className="account-action-button account-primary account-full-width">
                                <i className="fa-solid fa-download"></i> {t('download')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="account-col-md-6">
                    <div className="account-statement-card">
                        <div className="account-statement-header">
                            <i className="fa-solid fa-file-lines"></i>
                            <div className="account-statement-title">{t('customStatement')}</div>
                        </div>
                        <div className="account-statement-form">
                            <div className='d-md-flex gap-2'   >
                                <div className="account-form-group">
                                    <label>{t('fromDate')}</label>
                                    <input type="date" className="account-form-control" />
                                </div>
                                <div className="account-form-group">
                                    <label>{t('toDate')}</label>
                                    <input type="date" className="account-form-control" />
                                </div>
                            </div> 
                            <button className="account-action-button account-primary account-full-width">
                                <i className="fa-solid fa-wand-magic-sparkles"></i> {t('generateStatement')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="account-past-statements">
                <div className="account-section-title">{t('previousStatements')}</div>
                <div className="account-table-responsive">
                    <table className="account-statement-table">
                        <thead>
                            <tr>
                                <th>{t('period')}</th>
                                <th>{t('dateGenerated')}</th>
                                <th>{t('format')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>February 2025</td>
                                <td>March 1, 2025</td>
                                <td>PDF</td>
                                <td>
                                    <button className="account-action-button account-secondary account-sm">
                                        <i className="fa-solid fa-download"></i> {t('download')}
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>January 2025</td>
                                <td>February 1, 2025</td>
                                <td>PDF</td>
                                <td>
                                    <button className="account-action-button account-secondary account-sm">
                                        <i className="fa-solid fa-download"></i> {t('download')}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatementsTab;