import React, { useState, useEffect } from 'react';
import useScrollToTop from "../../../hooks/useScrollToTop";

const LoanApply = ({ setModule }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showLoanTypes, setShowLoanTypes] = useState(true);
  const [selectedLoanType, setSelectedLoanType] = useState('');
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    scrollToTop();
  }, [activeStep, selectedLoanType,showLoanTypes]);

  // State for application form
  const [formData, setFormData] = useState({
    accountNumber: '',
    fullName: '',
    email: '',
    mobile: '',
    loanType: '',
    amount: '',
    tenure: '',
    income: '',
    occupation: '',
    employerDetails: {
      name: '',
      address: '',
      experience: ''
    },
    existingLoans: false,
    propertyDetails: {
      type: '',
      value: '',
      address: ''
    }
  });

  // State for application status
  const [applicationStatus, setApplicationStatus] = useState({
    submitted: false,
    applicationId: '',
    status: ''
  });

  // Loan types data
  const loanTypes = [
    {
      id: 'home',
      title: 'Home Loan',
      description: 'Make your dream home a reality',
      interestRate: '8.50',
      maxAmount: '5,00,00,000',
      maxTenure: 30,
      features: [
        'Competitive interest rates',
        'Quick approval process',
        'Flexible repayment options',
        'No prepayment charges'
      ]
    },
    {
      id: 'personal',
      title: 'Personal Loan',
      description: 'Quick loans for your personal needs',
      interestRate: '12.50',
      maxAmount: '25,00,000',
      maxTenure: 5,
      features: [
        'No collateral required',
        'Minimal documentation',
        'Quick disbursement',
        'Flexible end-use'
      ]
    },
    {
      id: 'vehicle',
      title: 'Vehicle Loan',
      description: 'Finance your dream vehicle',
      interestRate: '9.50',
      maxAmount: '50,00,000',
      maxTenure: 7,
      features: [
        'Competitive rates',
        'Quick processing',
        'Up to 100% financing',
        'Flexible tenure options'
      ]
    },
    {
      id: 'education',
      title: 'Education Loan',
      description: 'Invest in your future',
      interestRate: '7.50',
      maxAmount: '75,00,000',
      maxTenure: 15,
      features: [
        'Covers tuition & living expenses',
        'Moratorium period available',
        'Tax benefits under 80E',
        'Collateral free up to TZS  7.5 lakhs'
      ]
    }
  ];

  // Eligibility criteria
  const eligibilityCriteria = {
    'home': {
      type: 'Home Loan',
      criteria: [
        'Age: 21-65 years',
        'Minimum income: TZS  30,000/month',
        'Employment stability: 2 years',
        'Good credit score (700+)',
        'Property documentation'
      ]
    },
    'personal': {
      type: 'Personal Loan',
      criteria: [
        'Age: 21-60 years',
        'Minimum income: TZS  25,000/month',
        'Employment stability: 1 year',
        'Good credit score (650+)',
        'No defaults in past loans'
      ]
    },
    'vehicle': {
      type: 'Vehicle Loan',
      criteria: [
        'Age: 21-65 years',
        'Minimum income: TZS  20,000/month',
        'Employment stability: 1 year',
        'Good credit score (650+)',
        'Vehicle documentation'
      ]
    },
    'education': {
      type: 'Education Loan',
      criteria: [
        'Age: 18+ years',
        'Admission to recognized institution',
        'Co-applicant required',
        'Academic records',
        'Collateral for loans above TZS  7.5 lakhs'
      ]
    }
  };

  // Calculate EMI
  const calculateEMI = () => {
    const P = parseFloat(formData.amount) || 0;
    const N = parseFloat(formData.tenure) || 0;
    const R = parseFloat(loanTypes.find(l => l.id === selectedLoanType)?.interestRate) / 1200;

    if (P && N && R) {
      const emi = P * R * Math.pow(1 + R, N * 12) / (Math.pow(1 + R, N * 12) - 1);
      return Math.round(emi);
    }
    return 0;
  };

  // Handle starting the application process
  const handleApplyNow = (loanId) => {
    setShowLoanTypes(false);
    setSelectedLoanType(loanId);
    setActiveStep(1);
    setFormData({
      ...formData,
      loanType: loanId
    });
  };

  // Handle moving between steps
  const handleNextStep = () => setActiveStep(activeStep + 1);
  const handlePrevStep = () => setActiveStep(activeStep - 1);
  const handleCancel = () => {
    setSelectedLoanType('');
    setShowLoanTypes(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, field] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationId = 'LOAN' + Math.floor(100000 + Math.random() * 900000);

    setApplicationStatus({
      submitted: true,
      applicationId: applicationId,
      status: 'Processing'
    });

    setActiveStep(3);
  };

  return (
    <div className="wallet-container wallet-section">
      <div className="wallet-card wallet-fade-in">
        <div className="wallet-card-header">
          <h5 className="mb-0">Loan Application</h5>
        </div>
        <div className="wallet-card-body">
          {/* Loan Types Section */}
          {showLoanTypes && (
            <div className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">Types of Loans</div>
                <div className="row">
                  {loanTypes.map(loan => (
                    <div key={loan.id} className="col-md-6 mb-3">
                      <div className="feature-card" style={{ height: '100%' }}>
                        <div className="feature-title">
                          <i className="fa-solid fa-money-bill-wave"></i> {loan.title}
                        </div>
                        <div className="feature-description">
                          {loan.description}
                        </div>
                        <div className="mt-2">
                          <div><strong>Interest Rate:</strong> {loan.interestRate}% p.a.</div>
                          <div><strong>Max Amount:</strong> TZS  {loan.maxAmount}</div>
                          <div><strong>Max Tenure:</strong> {loan.maxTenure} years</div>
                        </div>
                        <ul className="mt-2" style={{ paddingLeft: '20px', fontSize: '14px' }}>
                          {loan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                        <button
                          className="action-button primary mt-2 w-100"
                          onClick={() => handleApplyNow(loan.id)}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Application Flow Section */}
          {selectedLoanType && (
            <div id="application-flow" className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">
                  {loanTypes.find(l => l.id === selectedLoanType)?.title} Application
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
                    <small style={{ color: activeStep >= 1 ? '#00a651' : '#757575' }}>Eligibility</small>
                    <small style={{ color: activeStep >= 2 ? '#00a651' : '#757575' }}>Application Form</small>
                    <small style={{ color: activeStep >= 3 ? '#00a651' : '#757575' }}>Status</small>
                  </div>
                </div>

                {/* Step 1: Eligibility */}
                {activeStep === 1 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">Eligibility Criteria</div>
                    <div className="card-status">
                      <span className="status-label">{eligibilityCriteria[selectedLoanType].type}:</span>
                    </div>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      {eligibilityCriteria[selectedLoanType].criteria.map((criterion, idx) => (
                        <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>{criterion}</li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between mt-4">
                      <button className="action-button secondary" onClick={handleCancel}>
                        Cancel
                      </button>
                      <button className="action-button primary" onClick={handleNextStep}>
                        Next <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Application Form */}
                {activeStep === 2 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">Application Form</div>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Personal Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">Personal Details</div>
                            <div className="mb-3">
                              <label className="form-label">Account Number</label>
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
                              <label className="form-label">Full Name</label>
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
                              <label className="form-label">Email</label>
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
                              <label className="form-label">Mobile Number</label>
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

                        {/* Loan Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">Loan Details</div>
                            <div className="mb-3">
                              <label className="form-label">Loan Amount</label>
                              <input
                                type="number"
                                className="form-control"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Tenure (Years)</label>
                              <input
                                type="number"
                                className="form-control"
                                name="tenure"
                                value={formData.tenure}
                                onChange={handleInputChange}
                                min="1"
                                max={loanTypes.find(l => l.id === selectedLoanType)?.maxTenure}
                                required
                              />
                            </div>
                            {formData.amount && formData.tenure && (
                              <div className="alert alert-info">
                                <strong>Monthly EMI:</strong> TZS  {calculateEMI().toLocaleString()}
                                <br />
                                <small>*Subject to final approval</small>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Employment Details */}
                        <div className="col-lg-12 mt-3">
                          <div className="card-information">
                            <div className="section-title">Employment Details</div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Annual Income</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="income"
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Occupation</label>
                                  <select
                                    className="form-select"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select occupation</option>
                                    <option value="salaried">Salaried</option>
                                    <option value="self-employed">Self Employed</option>
                                    <option value="business">Business Owner</option>
                                    <option value="professional">Professional</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Employer Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="employerDetails.name"
                                    value={formData.employerDetails.name}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Work Experience (Years)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="employerDetails.experience"
                                    value={formData.employerDetails.experience}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Property Details (for Home Loan) */}
                        {selectedLoanType === 'home' && (
                          <div className="col-lg-12 mt-3">
                            <div className="card-information">
                              <div className="section-title">Property Details</div>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Property Type</label>
                                    <select
                                      className="form-select"
                                      name="propertyDetails.type"
                                      value={formData.propertyDetails.type}
                                      onChange={handleInputChange}
                                      required
                                    >
                                      <option value="">Select property type</option>
                                      <option value="apartment">Apartment</option>
                                      <option value="independent">Independent House</option>
                                      <option value="villa">Villa</option>
                                      <option value="plot">Plot</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Property Value</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="propertyDetails.value"
                                      value={formData.propertyDetails.value}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="mb-3">
                                    <label className="form-label">Property Address</label>
                                    <textarea
                                      className="form-control"
                                      name="propertyDetails.address"
                                      value={formData.propertyDetails.address}
                                      onChange={handleInputChange}
                                      rows="3"
                                      required
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Additional Options */}
                        <div className="col-lg-12 mt-3">
                          <div className="mb-3 form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="existingLoans"
                              name="existingLoans"
                              checked={formData.existingLoans}
                              onChange={(e) => handleInputChange({
                                target: {
                                  name: 'existingLoans',
                                  value: e.target.checked
                                }
                              })}
                            />
                            <label className="form-check-label" htmlFor="existingLoans">
                              I have existing loans with this bank
                            </label>
                          </div>

                          <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="termsCheck" required />
                            <label className="form-check-label" htmlFor="termsCheck">
                              I agree to the Terms & Conditions and authorize the bank to verify my details
                            </label>
                          </div>

                          <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="action-button secondary" onClick={handlePrevStep}>
                              <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <button type="submit" className="action-button primary">
                              Submit Application <i className="fa-solid fa-paper-plane"></i>
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
                    <div className="section-title">Application Status</div>
                    {applicationStatus.submitted ? (
                      <div>
                        <div className="card-status mb-3">
                          <span className="status-label">Application ID:</span>
                          <span className="status-value status-active">
                            {applicationStatus.applicationId}
                          </span>
                        </div>
                        <div className="card-status mb-3">
                          <span className="status-label">Status:</span>
                          <span className="status-value status-active">
                            {applicationStatus.status}
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
                            <small>Application Received</small>
                            <small>Document Verification</small>
                            <small>Credit Assessment</small>
                            <small>Loan Disbursement</small>
                          </div>
                        </div>

                        <div className="upcoming-payment mt-3">
                          <div className="payment-details">
                            <div className="payment-date">Expected Processing Time:</div>
                            <div className="payment-description">
                              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="d-flex justify-content-between">
                              <button className="action-button secondary" onClick={() => {
                                setSelectedLoanType('');
                                setShowLoanTypes(true);
                                setActiveStep(0);
                                setFormData({    accountNumber: '',
                                  fullName: '',
                                  email: '',
                                  mobile: '',
                                  loanType: '',
                                  amount: '',
                                  tenure: '',
                                  income: '',
                                  occupation: '',
                                  employerDetails: {
                                    name: '',
                                    address: '',
                                    experience: ''
                                  },
                                  existingLoans: false,
                                  propertyDetails: {
                                    type: '',
                                    value: '',
                                    address: ''
                                  }
                                })
                              }}>
                                New Application
                              </button>
                              <button className="action-button primary" onClick={() => {
                                alert('The print receipt feature is not available yet');
                              }}>
                                <i className="fa-solid fa-print"></i> Print Receipt
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="fa-solid fa-money-bill-wave"></i>
                        <p>Application not submitted yet</p>
                        <small>Please complete the application form</small>
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

export default LoanApply;