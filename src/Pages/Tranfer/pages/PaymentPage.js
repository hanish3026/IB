import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BeneficiarieApis from '../Apis/BeneficiarieApi';
import '../css/PaymentPage.css';
import { ScaleLoader } from "react-spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faArrowRight, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const PaymentPage = () => {
  const { beneficiaryId } = useParams();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [transactionSuccess, setTransactionSuccess] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [stepLoading, setStepLoading] = useState(false); // Add this line
  
  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState({
    paymentType: '',
    amount: '',
    remarks: '',
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: '',
    purpose: 'personal',
    otp: '',
  });
  
  // Payment type information
  const paymentTypeInfo = {
    IMPS: {
      name: 'IMPS - Immediate Payment Service',
      charges: 'TZS  5.00',
      availability: '24x7',
      description: 'Instant transfer, usually completed within seconds.',
      maxAmount: 200000,
    },
    NEFT: {
      name: 'NEFT - National Electronic Funds Transfer',
      charges: 'TZS  2.50',
      availability: 'Working hours (8 AM - 7 PM)',
      description: 'Batch processing, may take up to 2 hours.',
      maxAmount: 1000000,
    },
  };

  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      try {
        setLoading(true);
        // Use the getBeneficiaryById method to fetch the specific beneficiary
        const response = await BeneficiarieApis.getBeneficiaryById(beneficiaryId);
        
        if (response && response.status === "success" && response.data) {
          const foundBeneficiary = response.data;
          
          setBeneficiary({
            id: foundBeneficiary.id,
            name: foundBeneficiary.beneficiary_name,
            accountNumber: foundBeneficiary.account_number,
            bankName: foundBeneficiary.bank_name,
            ifsc: foundBeneficiary.ifsc_code,
            type: foundBeneficiary.account_type.toLowerCase()
          });
          
          // Set default payment type based on bank
          if (foundBeneficiary.bank_name === "Your Bank Name") {
            setPaymentDetails({...paymentDetails, paymentType: 'INTERNAL'});
          }
        } else {
          console.error("Beneficiary not found or invalid response format");
        }
      } catch (error) {
        console.error("Error fetching beneficiary details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBeneficiaryDetails();
  }, [beneficiaryId]);

  const validatePaymentType = () => {
    const errors = {};
    
    if (!paymentDetails.paymentType) {
      errors.paymentType = "Please select a payment type";
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentDetails = () => {
    const errors = {};
    const selectedType = paymentTypeInfo[paymentDetails.paymentType];
    
    if (!paymentDetails.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(paymentDetails.amount) || parseFloat(paymentDetails.amount) <= 0) {
      errors.amount = "Please enter a valid amount";
    } else {
      const amount = parseFloat(paymentDetails.amount);
      
      if (selectedType.minAmount && amount < selectedType.minAmount) {
        errors.amount = `Minimum amount for ${paymentDetails.paymentType} is TZS  ${selectedType.minAmount.toLocaleString()}`;
      }
      
      if (selectedType.maxAmount && amount > selectedType.maxAmount) {
        errors.amount = `Maximum amount for ${paymentDetails.paymentType} is TZS  ${selectedType.maxAmount.toLocaleString()}`;
      }
    }
    
    if (paymentDetails.scheduleType === 'later' && !paymentDetails.scheduleDate) {
      errors.scheduleDate = "Please select a date for scheduled payment";
    }
    
    if (paymentDetails.scheduleType === 'later' && !paymentDetails.scheduleTime) {
      errors.scheduleTime = "Please select a time for scheduled payment";
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOTP = () => {
    const errors = {};
    
    if (!paymentDetails.otp) {
      errors.otp = "Please enter the OTP";
    } else if (paymentDetails.otp.length !== 6 || !/^\d+$/.test(paymentDetails.otp)) {
      errors.otp = "OTP must be 6 digits";
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Only allow numbers and decimal point
      const formattedValue = value.replace(/[^\d.]/g, '');
      setPaymentDetails({...paymentDetails, [name]: formattedValue});
    } else {
      setPaymentDetails({...paymentDetails, [name]: value});
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validatePaymentType()) {
      setStepLoading(true);
      setTimeout(() => {
        setCurrentStep(2);
        window.scrollTo(0, 0);
        setStepLoading(false);
      }, 800);
    } else if (currentStep === 2 && validatePaymentDetails()) {
      setStepLoading(true);
      setTimeout(() => {
        setCurrentStep(3);
        window.scrollTo(0, 0);
        setStepLoading(false);
      }, 800);
    } else if (currentStep === 3) {
      setStepLoading(true);
      setTimeout(() => {
        setCurrentStep(4);
        window.scrollTo(0, 0);
        // Simulate OTP sent to mobile
        alert("OTP has been sent to your registered mobile number");
        setStepLoading(false);
      }, 800);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setStepLoading(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
        setStepLoading(false);
      }, 800);
    }
  };

  const handleSubmitPayment = async () => {
    if (!validateOTP()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a random reference number
      const refNumber = 'TXN' + Date.now().toString().slice(-8);
      setReferenceNumber(refNumber);
      
      // 90% chance of success for demo purposes
      const isSuccess = Math.random() < 0.9;
      setTransactionSuccess(isSuccess);
      
      setCurrentStep(5);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error processing payment:", error);
      setTransactionSuccess(false);
      setCurrentStep(5);
      window.scrollTo(0, 0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    alert("Receipt download functionality will be implemented here");
    // In a real implementation, this would generate a PDF receipt
  };

  const handleEmailReceipt = () => {
    alert("Receipt has been sent to your registered email address");
    // In a real implementation, this would send an email with the receipt
  };

  const renderPaymentTypeSelection = () => {
    return (
      <div className="payment-step">
        <h3>Select Payment Type</h3>
        <div className="payment-types-container">
          {Object.keys(paymentTypeInfo).map(type => (
            <div 
              key={type}
              className={`payment-type-card ${paymentDetails.paymentType === type ? 'selected' : ''}`}
              onClick={() => setPaymentDetails({...paymentDetails, paymentType: type})}
            >
              <div className="payment-type-header">
                <h4>{paymentTypeInfo[type].name}</h4>
              </div>
              <div className="payment-type-details">
                <p><strong>Charges:</strong> {paymentTypeInfo[type].charges}</p>
                <p><strong>Availability:</strong> {paymentTypeInfo[type].availability}</p>
                <p>{paymentTypeInfo[type].description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors.paymentType && <div className="error-message">{errors.paymentType}</div>}
      </div>
    );
  };
}
export default PaymentPage