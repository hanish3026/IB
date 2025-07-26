import { faL } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useScrollToTop from '../../../hooks/useScrollToTop';
// import "../css/card.css";

const AccountOpening = ({setModule}) => {
  const { t } = useTranslation('apply');
  
  // States for application flow
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [showAccountTypes,setShowAccountTypes] = useState(true)
  const scrollToTop = useScrollToTop();
  // State for application form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    accountType: '',
    dob: '',
    panCard: '',
    addressProof: '',
    idProof: '',
    initialDeposit: '',
    employmentStatus: 'employed',
    annualIncome: ''
  });

  // State for application status
  const [applicationStatus, setApplicationStatus] = useState({
    submitted: false,
    applicationId: '',
    status: ''
  });

  // Account types data
  const accountTypes = [
    {
      id: 'savings',
      title: t('savingsAccount'),
      description: t('savingsAccountDescription'),
      minBalance: 5000,
      interestRate: '3.5% p.a.',
      features: [t('freeDigitalBanking'), t('debitCard'), t('monthlyInterestCredits'), t('autoBillPayments')]
    },
    {
      id: 'current',
      title: t('currentAccount'),
      description: t('currentAccountDescription'),
      minBalance: 25000,
      interestRate: '0% p.a.',
      features: [t('unlimitedTransactions'), t('overdraftFacility'), t('multiUserAccess'), t('chequeBookFacility')]
    },
    {
      id: 'fixed',
      title: t('fixedDeposit'),
      description: t('fixedDepositDescription'),
      minBalance: 10000,
      interestRate: '6.5% p.a.',
      features: [t('higherInterestRates'), t('flexibleTenureOptions'), t('loanAgainstFD'), t('autoRenewalOption')]
    },
    {
      id: 'recurring',
      title: t('recurringDeposit'),
      description: t('recurringDepositDescription'),
      minBalance: 1000,
      interestRate: '5.8% p.a.',
      features: [t('monthlyDepositScheme'), t('fixedTenure'), t('compoundedInterest'), t('prematureWithdrawalOption')]
    }
  ];

  // Documents required data
  const documentsRequired = [
    {
      id: 'identity',
      title: t('identityProof'),
      description: t('anyOneOfFollowing'),
      documents: [t('aadhaarCard'), t('passport'), t('voterIdCard'), t('drivingLicense')]
    },
    {
      id: 'address',
      title: t('addressProof'),
      description: t('anyOneOfFollowing'),
      documents: [t('aadhaarCard'), t('passport'), t('utilityBill'), t('rentalAgreement')]
    },
    {
      id: 'financial',
      title: t('financialDocuments'),
      description: t('requiredForAllAccounts'),
      documents: [t('panCard'), t('incomeTaxReturns'), t('form16')]
    }
  ];

  // Eligibility criteria data
  const eligibilityCriteria = {
    'savings': {
      accountType: t('savingsAccount'),
      criteria: [
        t('age18AndAbove'),
        t('residentialStatus'),
        t('validIdAndAddress'),
        t('initialDeposit5000')
      ]
    },
    'current': {
      accountType: t('currentAccount'),
      criteria: [
        t('businessEntity'),
        t('businessRegistration'),
        t('panAndGst'),
        t('initialDeposit25000')
      ]
    },
    'fixed': {
      accountType: t('fixedDeposit'),
      criteria: [
        t('guardiansForMinors'),
        t('validIdAndAddress'),
        t('minimumDeposit10000'),
        t('kycCompliantAccount')
      ]
    },
    'recurring': {
      accountType: t('recurringDeposit'),
      criteria: [
        t('guardiansForMinors'),
        t('validIdAndAddress'),
        t('minimumDeposit1000'),
        t('monthlyDeposits')
      ]
    }
  };

  // Handle starting the application process
  const handleApplyNow = (accountId) => {
    setShowAccountTypes(false)
    setSelectedAccountType(accountId);
    setActiveStep(1); // Move to eligibility criteria step
    setFormData({
      ...formData,
      accountType: accountId
    });
    
    // Scroll to the application flow section
    // document.getElementById('application-flow').scrollIntoView({
    //   behavior: 'smooth'
    // });
  };

  // Handle moving to next step
  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  // Handle moving to previous step
  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
function handleCancel(){
  setSelectedAccountType('')
  setShowAccountTypes(true)
}
  // Handle file uploads
  const handleFileUpload = (e) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.files[0] ? e.target.files[0].name : ''
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    scrollToTop();
    // Generate random application ID
    const applicationId = 'APP' + Math.floor(100000 + Math.random() * 900000);
    
    // In a real application, you would send data to backend
    // For demo, we'll just update the status
    setApplicationStatus({
      submitted: true,
      applicationId: applicationId,
      status: t('underReview')
    });
    
    // Move to final step (application status)
    setActiveStep(4);

  };

  return (
    <div className="wallet-container wallet-section">
      {/* Account Opening Main Card */}
      <div className="wallet-card wallet-fade-in">
        <div className="wallet-card-header">
          <h5 className="mb-0">{t('accountOpening')}</h5>
        </div>
        <div className="wallet-card-body">
          {/* Account Types Section */}
          {showAccountTypes && <div className="row mb-4">
            <div className="col-lg-12">
              <div className="section-title wallet-fade-in-delay-1">{t('typesOfAccounts')}</div>
              <div className="row">
                {accountTypes.map(account => (
                  <div key={account.id} className="col-md-6 col-lg-3 mb-3">
                    <div className="feature-card" style={{height: '100%'}}>
                      <div className="feature-title">
                        <i className="fa-solid fa-bank"></i> {account.title}
                      </div>
                      <div className="feature-description">
                        {account.description}
                      </div>
                      <div className="mt-2">
                        <div><strong>{t('minBalance')}:</strong> TZS  {account.minBalance.toLocaleString()}</div>
                        <div><strong>{t('interestRate')}:</strong> {account.interestRate}</div>
                      </div>
                      <ul className="mt-2" style={{paddingLeft: '20px', fontSize: '14px'}}>
                        {account.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                      <button className="action-button primary mt-2 w-100" onClick={() => handleApplyNow(account.id)}>
                        {t('applyNow')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>}
          
          {/* Application Flow Section */}
          {selectedAccountType && (
            <div id="application-flow" className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">
                  {accountTypes.find(a => a.id === selectedAccountType)?.title} {t('application')}
                </div>
                
                {/* Application Progress Bar */}
                <div className="mt-3 mb-4">
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${activeStep * 25}%` }} 
                      aria-valuenow={activeStep * 25} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small style={{color: activeStep >= 1 ? '#00a651' : '#757575'}}>{t('eligibility')}</small>
                    <small style={{color: activeStep >= 2 ? '#00a651' : '#757575'}}>{t('documents')}</small>
                    <small style={{color: activeStep >= 3 ? '#00a651' : '#757575'}}>{t('applicationForm')}</small>
                    <small style={{color: activeStep >= 4 ? '#00a651' : '#757575'}}>{t('status')}</small>
                  </div>
                </div>
                
                {/* Step 1: Eligibility Criteria */}
                {activeStep === 1 && eligibilityCriteria[selectedAccountType] && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">{t('eligibilityCriteria')}</div>
                    <div className="card-status">
                      <span className="status-label">{eligibilityCriteria[selectedAccountType].accountType}:</span>
                    </div>
                    <ul style={{paddingLeft: '20px', marginTop: '10px'}}>
                      {eligibilityCriteria[selectedAccountType].criteria.map((criterion, idx) => (
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
                
                {/* Step 2: Required Documents */}
                {activeStep === 2 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">{t('requiredDocuments')}</div>
                    <div className="row">
                      {documentsRequired.map(doc => (
                        <div key={doc.id} className="col-md-4 mb-3">
                          <div className="setting-item">
                            <div className="setting-info">
                              <i className="fa-solid fa-file-alt"></i>
                              <div className="setting-details">
                                <div className="setting-title">{doc.title}</div>
                                <div className="setting-description">{doc.description}</div>
                              </div>
                            </div>
                          </div>
                          <ul style={{paddingLeft: '20px', marginTop: '10px'}}>
                            {doc.documents.map((document, index) => (
                              <li key={index} style={{marginBottom: '8px', fontSize: '14px'}}>{document}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <button className="action-button secondary" onClick={handlePrevStep}>
                        <i className="fa-solid fa-arrow-left"></i> {t('back')}
                      </button>
                      <button className="action-button primary" onClick={handleNextStep}>
                        {t('next')} <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Application Form */}
                {activeStep === 3 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">{t('applicationForm')}</div>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Personal Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">{t('personalDetails')}</div>
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
                            <div className="mb-3">
                              <label className="form-label">{t('dateOfBirth')}</label>
                              <input 
                                type="date" 
                                className="form-control" 
                                name="dob" 
                                value={formData.dob} 
                                onChange={handleInputChange} 
                                required 
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Account Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">{t('accountDetails')}</div>
                            <div className="mb-3">
                              <label className="form-label">{t('accountType')}</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={accountTypes.find(a => a.id === selectedAccountType)?.title} 
                                readOnly 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">{t('initialDepositAmount')}</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="initialDeposit" 
                                value={formData.initialDeposit} 
                                onChange={handleInputChange} 
                                required 
                                min={accountTypes.find(a => a.id === selectedAccountType)?.minBalance || 0}
                              />
                              <small className="text-muted">
                                {t('minimumRequired')}: TZS  {accountTypes.find(a => a.id === selectedAccountType)?.minBalance.toLocaleString()}
                              </small>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">{t('employmentStatus')}</label>
                              <select 
                                className="form-select" 
                                name="employmentStatus" 
                                value={formData.employmentStatus} 
                                onChange={handleInputChange} 
                                required
                              >
                                <option value="employed">{t('employed')}</option>
                                <option value="self-employed">{t('selfEmployed')}</option>
                                <option value="business">{t('businessOwner')}</option>
                                <option value="student">{t('student')}</option>
                                <option value="retired">{t('retired')}</option>
                                <option value="other">{t('other')}</option>
                              </select>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">{t('annualIncome')}</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="annualIncome" 
                                value={formData.annualIncome} 
                                onChange={handleInputChange} 
                                required 
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Document Upload */}
                        <div className="col-lg-12 mt-3">
                          <div className="card-information">
                            <div className="section-title">{t('documentUpload')}</div>
                            <div className="row">
                              <div className="col-md-4 mb-3">
                                <label className="form-label">{t('panCard')}</label>
                                <input 
                                  type="file" 
                                  className="form-control" 
                                  name="panCard" 
                                  onChange={handleFileUpload} 
                                  required 
                                />
                                <small className="text-muted">{t('uploadClearCopy')}</small>
                              </div>
                              <div className="col-md-4 mb-3">
                                <label className="form-label">{t('addressProof')}</label>
                                <input 
                                  type="file" 
                                  className="form-control" 
                                  name="addressProof" 
                                  onChange={handleFileUpload} 
                                  required 
                                />
                                <small className="text-muted">{t('aadhaarPassportUtility')}</small>
                              </div>
                              <div className="col-md-4 mb-3">
                                <label className="form-label">{t('identityProof')}</label>
                                <input 
                                  type="file" 
                                  className="form-control" 
                                  name="idProof" 
                                  onChange={handleFileUpload} 
                                  required 
                                />
                                <small className="text-muted">{t('passportDrivingVoter')}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Terms and Submit */}
                        <div className="col-lg-12 mt-3">
                          <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="termsCheck" required />
                            <label className="form-check-label" htmlFor="termsCheck">
                              {t('termsAndConditions')}
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
                
                {/* Step 4: Application Status */}
                {activeStep === 4 && (
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
                            {t('underReview')}
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
                            <small>{t('accountProcessing')}</small>
                            <small>{t('complete')}</small>
                          </div>
                        </div>
                        
                        <div className="upcoming-payment mt-3">
                          <div className="payment-details">
                            <div className="payment-date">{t('nextUpdateExpected')}:</div>
                            <div className="payment-description">
                              {new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="d-flex justify-content-between">
                              <button className="action-button secondary" onClick={() => {
                                setSelectedAccountType('');
                                setShowAccountTypes(true);
                                setActiveStep(0);
                                setFormData({
                                })
                              }}>
                                {t('startNewApplication')}
                              </button>
                              <button className="action-button primary">
                                <i className="fa-solid fa-refresh"></i> {t('refreshStatus')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="fa-solid fa-search"></i>
                        <p>{t('applicationNotSubmitted')}</p>
                        <small>{t('pleaseCompleteForm')}</small>
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

export default AccountOpening;