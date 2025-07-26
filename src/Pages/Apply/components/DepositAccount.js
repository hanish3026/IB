import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DepositAccount = ({setModule}) => {
  const { t } = useTranslation('apply');
  
  const [activeStep, setActiveStep] = useState(0);
  const [showDepositTypes, setShowDepositTypes] = useState(true);
  const [selectedDepositType, setSelectedDepositType] = useState('');

  // State for application form
  const [formData, setFormData] = useState({
    accountNumber: '',
    fullName: '',
    email: '',
    mobile: '',
    depositType: '',
    amount: '',
    tenure: '',
    interestPayout: 'maturity',
    nomineeDetails: {
      name: '',
      relationship: '',
      dob: ''
    },
    autoRenewal: false
  });

  // State for application status
  const [applicationStatus, setApplicationStatus] = useState({
    submitted: false,
    applicationId: '',
    status: ''
  });

  // Deposit types data
  const depositTypes = [
    {
      id: 'fd',
      title: t('fixedDeposit'),
      description: t('fixedDepositDescription'),
      minAmount: 10000,
      tenureOptions: [
        { months: 6, rate: 5.5 },
        { months: 12, rate: 6.0 },
        { months: 24, rate: 6.5 },
        { months: 36, rate: 7.0 }
      ],
      features: [
        t('flexibleTenureOptions'),
        t('higherInterestRates'),
        t('loanFacilityAvailable'),
        t('autoRenewalOption')
      ]
    },
    {
      id: 'rd',
      title: t('recurringDeposit'),
      description: t('recurringDepositDescription'),
      minAmount: 1000,
      tenureOptions: [
        { months: 12, rate: 5.8 },
        { months: 24, rate: 6.2 },
        { months: 36, rate: 6.8 },
        { months: 60, rate: 7.2 }
      ],
      features: [
        t('monthlyDepositScheme'),
        t('disciplinedSavings'),
        t('competitiveInterestRates'),
        t('flexibleTenureOptions')
      ]
    }
  ];

  // Eligibility criteria
  const eligibilityCriteria = {
    'fd': {
      type: t('fixedDeposit'),
      criteria: [
        t('age18AndAbove'),
        t('validSavingsCurrentAccount'),
        t('minimumDeposit10000'),
        t('validKycDocuments')
      ]
    },
    'rd': {
      type: t('recurringDeposit'),
      criteria: [
        t('age18AndAbove'),
        t('activeSavingsAccount'),
        t('minimumMonthlyDeposit'),
        t('sufficientBalance')
      ]
    }
  };

  // Handle starting the application process
  const handleApplyNow = (depositId) => {
    setShowDepositTypes(false);
    setSelectedDepositType(depositId);
    setActiveStep(1);
    setFormData({
      ...formData,
      depositType: depositId
    });
  };

  // Handle moving between steps
  const handleNextStep = () => setActiveStep(activeStep + 1);
  const handlePrevStep = () => setActiveStep(activeStep - 1);
  const handleCancel = () => {
    setSelectedDepositType('');
    setShowDepositTypes(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('nomineeDetails.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        nomineeDetails: {
          ...formData.nomineeDetails,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Calculate maturity amount
  const calculateMaturity = () => {
    const amount = parseFloat(formData.amount) || 0;
    const selectedDeposit = depositTypes.find(d => d.id === selectedDepositType);
    const selectedTenure = selectedDeposit?.tenureOptions.find(t => t.months.toString() === formData.tenure);
    
    if (!selectedTenure) return 0;

    if (selectedDepositType === 'fd') {
      const rate = selectedTenure.rate / 100;
      const years = selectedTenure.months / 12;
      return amount * (1 + rate * years);
    } else {
      // RD calculation
      const rate = selectedTenure.rate / 100 / 12; // Monthly rate
      const months = selectedTenure.months;
      return amount * months * (1 + rate * (months + 1) / 2);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationId = 'DEP' + Math.floor(100000 + Math.random() * 900000);
    
    setApplicationStatus({
      submitted: true,
      applicationId: applicationId,
      status: t('processing')
    });
    
    setActiveStep(3);
  };

  return (
    <div className="wallet-container wallet-section">
      <div className="wallet-card wallet-fade-in">
        <div className="wallet-card-header">
          <h5 className="mb-0">{t('depositAccountApplication')}</h5>
        </div>
        <div className="wallet-card-body">
          {/* Deposit Types Section */}
          {showDepositTypes && (
            <div className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">{t('typesOfDeposits')}</div>
                <div className="row">
                  {depositTypes.map(deposit => (
                    <div key={deposit.id} className="col-md-6 mb-3">
                      <div className="feature-card" style={{height: '100%'}}>
                        <div className="feature-title">
                          <i className="fa-solid fa-piggy-bank"></i> {deposit.title}
                        </div>
                        <div className="feature-description">
                          {deposit.description}
                        </div>
                        <div className="mt-2">
                          <div><strong>{t('minAmount')}:</strong> TZS  {deposit.minAmount.toLocaleString()}</div>
                          <div><strong>{t('interestRates')}:</strong></div>
                          <ul className="mt-1" style={{fontSize: '14px'}}>
                            {deposit.tenureOptions.map((option, idx) => (
                              <li key={idx}>{option.months} {t('months')}: {option.rate}% p.a.</li>
                            ))}
                          </ul>
                        </div>
                        <ul className="mt-2" style={{paddingLeft: '20px', fontSize: '14px'}}>
                          {deposit.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                        <button 
                          className="action-button primary mt-2 w-100" 
                          onClick={() => handleApplyNow(deposit.id)}
                        >
                          {deposit.id === 'fd' ? t('openFixedDeposit') : t('openRecurringDeposit')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Application Flow Section */}
          {selectedDepositType && (
            <div id="application-flow" className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">
                  {depositTypes.find(d => d.id === selectedDepositType)?.title} {t('application')}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3 mb-4">
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${activeStep * 33.33}%` }} 
                      aria-valuenow={activeStep * 33.33} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small style={{color: activeStep >= 1 ? '#00a651' : '#757575'}}>{t('eligibility')}</small>
                    <small style={{color: activeStep >= 2 ? '#00a651' : '#757575'}}>{t('applicationForm')}</small>
                    <small style={{color: activeStep >= 3 ? '#00a651' : '#757575'}}>{t('status')}</small>
                  </div>
                </div>

                {/* Step 1: Eligibility */}
                {activeStep === 1 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">{t('eligibilityCriteria')}</div>
                    <div className="card-status">
                      <span className="status-label">{eligibilityCriteria[selectedDepositType].type}:</span>
                    </div>
                    <ul style={{paddingLeft: '20px', marginTop: '10px'}}>
                      {eligibilityCriteria[selectedDepositType].criteria.map((criterion, idx) => (
                        <li key={idx} style={{marginBottom: '8px', fontSize: '14px'}}>{criterion}</li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between mt-4">
                      <button className="action-button secondary" onClick={handleCancel}>
                        {t('cancel')}
                      </button>
                      <button className="action-button primary" onClick={handleNextStep}>
                        {t('next')} <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Application Form */}
                {activeStep === 2 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">{t('applicationForm')}</div>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Account Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">{t('accountDetails')}</div>
                            <div className="mb-3">
                              <label className="form-label">{t('accountNumber')}</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">{t('fullName')}</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">{t('emailAddress')}</label>
                              <input 
                                type="email" 
                                className="form-control" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">{t('mobileNumber')}</label>
                              <input 
                                type="tel" 
                                className="form-control" 
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Deposit Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">{t('depositDetails')}</div>
                            <div className="mb-3">
                              <label className="form-label">
                                {selectedDepositType === 'fd' ? t('depositAmount') : t('monthlyDepositAmount')}
                              </label>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                min={depositTypes.find(d => d.id === selectedDepositType)?.minAmount}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">{t('tenure')}</label>
                              <select 
                                className="form-select"
                                name="tenure"
                                value={formData.tenure}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">{t('selectTenure')}</option>
                                {depositTypes.find(d => d.id === selectedDepositType)?.tenureOptions.map(option => (
                                  <option key={option.months} value={option.months}>
                                    {option.months} {t('months')} @ {option.rate}% p.a.
                                  </option>
                                ))}
                              </select>
                            </div>
                            {selectedDepositType === 'fd' && (
                              <div className="mb-3">
                                <label className="form-label">{t('interestPayout')}</label>
                                <select 
                                  className="form-select"
                                  name="interestPayout"
                                  value={formData.interestPayout}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="maturity">{t('atMaturity')}</option>
                                  <option value="monthly">{t('monthly')}</option>
                                  <option value="quarterly">{t('quarterly')}</option>
                                </select>
                              </div>
                            )}
                            {formData.amount && formData.tenure && (
                              <div className="alert alert-info">
                                <strong>{t('maturityAmount')}:</strong> TZS  {Math.round(calculateMaturity()).toLocaleString()}
                                <br />
                                <small>{t('taxAndTdsNote')}</small>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Nominee Details */}
                        <div className="col-lg-12 mt-3">
                          <div className="card-information">
                            <div className="section-title">{t('nomineeDetails')}</div>
                            <div className="row">
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label">{t('nomineeName')}</label>
                                  <input 
                                    type="text" 
                                    className="form-control" 
                                    name="nomineeDetails.name"
                                    value={formData.nomineeDetails.name}
                                    onChange={handleInputChange}
                                    required 
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label">{t('relationship')}</label>
                                  <input 
                                    type="text" 
                                    className="form-control"
                                    name="nomineeDetails.relationship"
                                    value={formData.nomineeDetails.relationship}
                                    onChange={handleInputChange}
                                    required 
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label">{t('dateOfBirth')}</label>
                                  <input 
                                    type="date" 
                                    className="form-control" 
                                    name="nomineeDetails.dob"
                                    value={formData.nomineeDetails.dob}
                                    onChange={handleInputChange}
                                    required 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3 form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input" 
                              id="autoRenewal"
                              name="autoRenewal"
                              checked={formData.autoRenewal}
                              onChange={(e) => handleInputChange({
                                target: {
                                  name: 'autoRenewal',
                                  value: e.target.checked
                                }
                              })}
                            />
                            <label className="form-check-label" htmlFor="autoRenewal">
                              {t('enableAutoRenewal')}
                            </label>
                          </div>

                          <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="termsCheck" required />
                            <label className="form-check-label" htmlFor="termsCheck">
                              {t('termsAndConditionsShort')}
                            </label>
                          </div>

                          <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="action-button secondary" onClick={handlePrevStep}>
                              <i className="fa-solid fa-arrow-left"></i> {t('back')}
                            </button>
                            <button type="submit" className="action-button primary">
                              {t('submitApplication')} <i className="fa-solid fa-paper-plane"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Application Status */}
                {activeStep === 3 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">{t('applicationStatus')}</div>
                    {applicationStatus.submitted ? (
                      <div>
                        <div className="card-status mb-3">
                          <span className="status-label">{t('applicationId')}:</span>
                          <span className="status-value status-active">
                            {applicationStatus.applicationId}
                          </span>
                        </div>
                        <div className="card-status mb-3">
                          <span className="status-label">{t('currentStatus')}:</span>
                          <span className="status-value status-active">
                            {t('processing')}
                          </span>
                        </div>
                        
                        <div className="mt-3">
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: '25%' }} 
                              aria-valuenow="25" 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between mt-2">
                            <small>{t('applicationReceived')}</small>
                            <small>{t('documentVerification')}</small>
                            <small>{t('accountCreation')}</small>
                            <small>{t('depositActivation')}</small>
                          </div>
                        </div>
                        
                        <div className="upcoming-payment mt-3">
                          <div className="payment-details">
                            <div className="payment-date">{t('expectedActivationDate')}:</div>
                            <div className="payment-description">
                              {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="d-flex justify-content-between">
                              <button className="action-button secondary" onClick={() => {
                                setSelectedDepositType('');
                                setShowDepositTypes(true);
                                setActiveStep(0);
                                setFormData({accountNumber: '',
                                  fullName: '',
                                  email: '',
                                  mobile: '',
                                  depositType: '',
                                  amount: '',
                                  tenure: '',
                                  interestPayout: 'maturity',
                                  nomineeDetails: {
                                    name: '',
                                    relationship: '',
                                    dob: ''
                                  },
                                  autoRenewal: false
                                })
                              }}>
                                {t('newApplication')}
                              </button>
                              <button className="action-button primary">
                                <i className="fa-solid fa-print"></i> {t('printReceipt')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="fa-solid fa-piggy-bank"></i>
                        <p>{t('applicationNotSubmittedYet')}</p>
                        <small>{t('pleaseCompleteApplicationForm')}</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositAccount;