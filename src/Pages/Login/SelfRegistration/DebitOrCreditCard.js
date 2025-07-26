import React, { useState, useEffect } from 'react'
import { useScrollContainerToTop } from '../../../hooks/useScrollToTop';
import RegistrationSuccessModal from './RegistrationSuccessModal';

const DebitOrCreditCard = ({setShowRegister}) => {
const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: OTP/PIN, 3: UserID, 4: Security Questions, 5: Security Images
  const scrollContainerToTop = useScrollContainerToTop()

  useEffect(() => {
    scrollContainerToTop('.login-form-section');
  }, [scrollContainerToTop]);

  useEffect(() => {
    scrollContainerToTop('.login-form-section');
  }, [currentStep, scrollContainerToTop]);

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cardHolderName: '',
    mobileNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    dob: ''
  });

  const [otpData, setOtpData] = useState({
    emailOtp: '',
    smsOtp: '',
    pin: ''
  });

  const [userIdData, setUserIdData] = useState({
    userId: '',
    isAvailable: null,
    isChecking: false
  });

  // Security Questions State
  const [securityQuestionsData, setSecurityQuestionsData] = useState({
    securityId: '',
    questions: [
      { type: '', question: '', answer: '' },
      { type: '', question: '', answer: '' },
      { type: '', question: '', answer: '' }
    ]
  });

  // Security Images State
  const [securityImagesData, setSecurityImagesData] = useState({
    securityId: '',
    images: [],
    currentImage: {
      file: null,
      url: '',
      type: '',
      description: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationType, setVerificationType] = useState('otp'); // 'otp' or 'pin'
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Security Question Types
  const securityQuestionTypes = [
    { value: 'personal', label: 'Personal Information' },
    { value: 'childhood', label: 'Childhood & Family' },
    { value: 'favorites', label: 'Favorites & Preferences' },
    { value: 'places', label: 'Places & Travel' },
    { value: 'education', label: 'Education & Work' }
  ];

  // Security Questions by Type
  const securityQuestionsByType = {
    personal: [
      "What is your mother's maiden name?",
      "What was the name of your first pet?",
      "What is your favorite color?",
      "What is your father's middle name?"
    ],
    childhood: [
      "What was the name of your elementary school?",
      "What was your childhood nickname?",
      "What was the name of your first best friend?",
      "In what city were you born?"
    ],
    favorites: [
      "What is your favorite movie?",
      "What is your favorite food?",
      "What is your favorite book?",
      "What is your favorite sports team?"
    ],
    places: [
      "What city did you meet your spouse/partner in?",
      "What was the first concert you attended?",
      "What is your dream vacation destination?",
      "What was your first job location?"
    ],
    education: [
      "What was your high school mascot?",
      "What was your first job?",
      "What university did you attend?",
      "What was your favorite subject in school?"
    ]
  };

  // Image Types
  const imageTypes = [
    { value: 'nature', label: 'Nature & Landscapes' },
    { value: 'animals', label: 'Animals & Pets' },
    { value: 'abstract', label: 'Abstract & Patterns' },
    { value: 'architecture', label: 'Architecture & Buildings' },
    { value: 'sports', label: 'Sports & Activities' },
    { value: 'food', label: 'Food & Beverages' }
  ];

  // Generate Security ID
  const generateSecurityId = () => {
    return 'SEC' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Initialize Security IDs when reaching respective steps
  useEffect(() => {
    if (currentStep === 4 && !securityQuestionsData.securityId) {
      setSecurityQuestionsData(prev => ({
        ...prev,
        securityId: generateSecurityId()
      }));
    }
    if (currentStep === 5 && !securityImagesData.securityId) {
      setSecurityImagesData(prev => ({
        ...prev,
        securityId: generateSecurityId()
      }));
    }
  }, [currentStep, securityQuestionsData.securityId, securityImagesData.securityId]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateCardNumber = (cardNumber) => {
    // Remove dashes and check if it's 16 digits
    const cleanCardNumber = cardNumber.replace(/-/g, '');
    return cleanCardNumber.length === 16 && /^\d+$/.test(cleanCardNumber);
  };

  const validateExpiryDate = (expiryDate) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    
    return true;
  };

  const validateCardHolderName = (name) => {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validateName = (name) => {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validateDOB = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 100;
  };

  const validatePin = (pin) => {
    return pin.length === 4 && /^\d+$/.test(pin);
  };

  // Format card number with dashes after every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '');
    const formatted = v.replace(/(\d{4})(?=\d)/g, '$1-');
    return formatted;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserIdChange = (e) => {
    const { value } = e.target;
    setUserIdData(prev => ({
      ...prev,
      userId: value,
      isAvailable: null // Reset availability when user changes the ID
    }));
  };

  const handleVerificationTypeChange = (e) => {
    setVerificationType(e.target.value);
    // Clear OTP/PIN data when switching types
    setOtpData({
      emailOtp: '',
      smsOtp: '',
      pin: ''
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Enter valid expiry date (MM/YY)';
    }

    if (!validateCardHolderName(formData.cardHolderName)) {
      newErrors.cardHolderName = 'Card holder name must be at least 2 characters';
    }

    if (!validateMobile(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter valid 10-digit mobile number';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }

    if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!validateDOB(formData.dob)) {
      newErrors.dob = 'Age must be between 18 and 100 years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (Step 1)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to send OTP or prepare for PIN
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOtpSent(true);
      setCurrentStep(2);
      // Manually scroll to top after step change
      setTimeout(() => scrollContainerToTop('.login-form-section'), 100);
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP/PIN verification (Step 2)
  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (verificationType === 'otp') {
      if (!otpData.emailOtp || !otpData.smsOtp) {
        alert('Please enter both Email and SMS OTP');
        return;
      }
    } else if (verificationType === 'pin') {
      if (!validatePin(otpData.pin)) {
        alert('Please enter a valid 4-digit PIN');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Simulate OTP/PIN verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(3);
      // Manually scroll to top after step change
      setTimeout(() => scrollContainerToTop('.login-form-section'), 100);
    } catch (error) {
      console.error('Error verifying:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle User ID completion (Step 3 -> Step 4)
  const handleUserIdCompletion = async (e) => {
    e.preventDefault();
    
    if (!userIdData.userId || userIdData.isAvailable !== true) {
      alert('Please enter an available User ID');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate User ID creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(4);
      // Manually scroll to top after step change
      setTimeout(() => scrollContainerToTop('.login-form-section'), 100);
    } catch (error) {
      console.error('Error creating User ID:', error);
      alert('Failed to create User ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Security Questions submission (Step 4 -> Step 5)
  const handleSecurityQuestionsSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that all 3 questions are answered
    const validQuestions = securityQuestionsData.questions.filter(q => 
      q.type && q.question && q.answer.trim()
    );
    
    if (validQuestions.length !== 3) {
      alert('Please answer all 3 security questions');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate security questions submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(5);
      // Manually scroll to top after step change
      setTimeout(() => scrollContainerToTop('.login-form-section'), 100);
    } catch (error) {
      console.error('Error saving security questions:', error);
      alert('Failed to save security questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Security Images submission (Final Step)
  const handleSecurityImagesSubmit = async (e) => {
    e.preventDefault();
    
    if (securityImagesData.images.length !== 3) {
      alert('Please upload exactly 3 security images');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate final registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error completing registration:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      // Simulate resend OTP API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('OTP resent successfully!');
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Security Questions changes
  const handleSecurityQuestionChange = (index, field, value) => {
    setSecurityQuestionsData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  // Handle Security Questions Reset
  const handleSecurityQuestionsReset = () => {
    setSecurityQuestionsData(prev => ({
      ...prev,
      questions: [
        { type: '', question: '', answer: '' },
        { type: '', question: '', answer: '' },
        { type: '', question: '', answer: '' }
      ]
    }));
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Read the file and store it in currentImage
    const reader = new FileReader();
    reader.onload = (event) => {
      setSecurityImagesData(prev => ({
        ...prev,
        currentImage: {
          ...prev.currentImage,
          file: file,
          url: event.target.result
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Current Image Update
  const handleCurrentImageUpdate = (field, value) => {
    setSecurityImagesData(prev => ({
      ...prev,
      currentImage: {
        ...prev.currentImage,
        [field]: value
      }
    }));
  };

  // Handle Add Image to Table
  const handleAddImageToTable = (e) => {
    e.preventDefault();
    
    const { file, url, type, description } = securityImagesData.currentImage;
    
    if (!file || !type || !description.trim()) {
      alert('Please fill in all fields before adding the image');
      return;
    }

    if (securityImagesData.images.length >= 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    const newImage = {
      id: Date.now(),
      file: file,
      url: url,
      type: type,
      description: description.trim()
    };
    
    setSecurityImagesData(prev => ({
      ...prev,
      images: [...prev.images, newImage],
      currentImage: {
        file: null,
        url: '',
        type: '',
        description: ''
      }
    }));

    // Reset file input
    const fileInput = document.querySelector('.file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle Image Delete
  const handleImageDelete = (imageId) => {
    setSecurityImagesData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowSuccessModal(false);
    setShowRegister(false);
  };

  // Handle cancel and reset form
  const handleCancel = () => {
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cardHolderName: '',
      mobileNumber: '',
      email: '',
      firstName: '',
      lastName: '',
      dob: ''
    });
    setOtpData({
      emailOtp: '',
      smsOtp: '',
      pin: ''
    });
    setUserIdData({
      userId: '',
      isAvailable: null,
      isChecking: false
    });
    setSecurityQuestionsData({
      securityId: '',
      questions: [
        { type: '', question: '', answer: '' },
        { type: '', question: '', answer: '' },
        { type: '', question: '', answer: '' }
      ]
    });
    setSecurityImagesData({
      securityId: '',
      images: [],
      currentImage: {
        file: null,
        url: '',
        type: '',
        description: ''
      }
    });
    setErrors({});
    setCurrentStep(1);
    setIsLoading(false);
    setOtpSent(false);
    setVerificationType('otp');
    setShowSuccessModal(false);
    setShowRegister(false);
    // Scroll to top when canceling
    setTimeout(() => scrollContainerToTop('.login-form-section'), 100);
  };

  // Handle User ID button action (Check availability or Final submit)
  const handleUserIdAction = async (e) => {
    e.preventDefault();
    
    // If availability hasn't been checked yet or User ID changed, check availability first
    if (userIdData.isAvailable === null || userIdData.isAvailable === false) {
      if (!userIdData.userId || userIdData.userId.length < 3) {
        alert('Please enter a User ID with at least 3 characters');
        return;
      }
      
      setUserIdData(prev => ({ ...prev, isChecking: true }));
      setIsLoading(true);
      
      try {
        // Simulate API call to check availability
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate random availability (for demo)
        const isAvailable = Math.random() > 0.5;
        setUserIdData(prev => ({ 
          ...prev, 
          isAvailable,
          isChecking: false 
        }));
      } catch (error) {
        console.error('Error checking user ID:', error);
        setUserIdData(prev => ({ ...prev, isChecking: false }));
        alert('Failed to check availability. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (userIdData.isAvailable === true) {
      // If User ID is available, proceed to security questions
      await handleUserIdCompletion(e);
    }
  };

  // Render Step 1: Card Details Form
  const renderCardDetailsForm = () => (
    <form onSubmit={handleFormSubmit}>
      <div className="form-field">
        <label>Card Number</label>
        <div className="input-group">
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234-5678-9012-3456"
            maxLength="19"
            className={errors.cardNumber ? 'error-input' : ''}
          />
        </div>
        {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
      </div>

      <div className="form-field">
        <label>Expiry Date</label>
        <div className="input-group">
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength="5"
            className={errors.expiryDate ? 'error-input' : ''}
          />
        </div>
        {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
      </div>

      <div className="form-field">
        <label>Card Holder Name</label>
        <div className="input-group">
          <input
            type="text"
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleInputChange}
            placeholder="Enter name as on card"
            className={errors.cardHolderName ? 'error-input' : ''}
          />
        </div>
        {errors.cardHolderName && <div className="error-message">{errors.cardHolderName}</div>}
      </div>

      <div className="form-field">
        <label>Registered Mobile Number</label>
        <div className="input-group">
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Enter your registered mobile number"
            className={errors.mobileNumber ? 'error-input' : ''}
          />
        </div>
        {errors.mobileNumber && <div className="error-message">{errors.mobileNumber}</div>}
      </div>

      <div className="form-field">
        <label>Registered Email</label>
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your registered email"
            className={errors.email ? 'error-input' : ''}
          />
        </div>
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-field">
        <label>First Name</label>
        <div className="input-group">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            className={errors.firstName ? 'error-input' : ''}
          />
        </div>
        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
      </div>

      <div className="form-field">
        <label>Last Name</label>
        <div className="input-group">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            className={errors.lastName ? 'error-input' : ''}
          />
        </div>
        {errors.lastName && <div className="error-message">{errors.lastName}</div>}
      </div>

      <div className="form-field">
        <label>Date of Birth</label>
        <div className="input-group">
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className={errors.dob ? 'error-input login-dob' : 'login-dob'}
          />
        </div>
        {errors.dob && <div className="error-message">{errors.dob}</div>}
      </div>

      <button 
        type="submit" 
        className="login-button"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Continue'}
      </button>
    </form>
  );

  // Render Step 2: OTP/PIN Verification
  const renderVerification = () => (
    <form onSubmit={handleVerification}>
      <div className="form-field">
        <label>Verification Method</label>
        <div className="input-group">
          <select 
            value={verificationType} 
            onChange={handleVerificationTypeChange}
            className="w-100 bg-white text-black p-3 rounded-3"
          >
            <option value="otp">OTP Verification</option>
            <option value="pin">PIN Verification</option>
          </select>
        </div>
      </div>

      {verificationType === 'otp' ? (
        <>
          <div className="otp-info">
            <p>OTP has been sent to your registered email and mobile number</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Mobile:</strong> {formData.mobileNumber}</p>
          </div>

          <div className="form-field">
            <label>Email OTP</label>
            <div className="input-group">
              <input
                type="text"
                name="emailOtp"
                value={otpData.emailOtp}
                onChange={handleOtpChange}
                placeholder="Enter OTP received on email"
                maxLength="6"
              />
            </div>
          </div>

          <div className="form-field">
            <label>SMS OTP</label>
            <div className="input-group">
              <input
                type="text"
                name="smsOtp"
                value={otpData.smsOtp}
                onChange={handleOtpChange}
                placeholder="Enter OTP received on mobile"
                maxLength="6"
              />
            </div>
          </div>

          <div className="resend-section">
            <p>Didn't receive OTP? 
              <button 
                type="button" 
                className="resend-button"
                onClick={handleResendOtp}
                disabled={isLoading}
              >
                {isLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            </p>
          </div>
        </>
      ) : (
        <div className="form-field">
          <label>Enter 4-Digit PIN</label>
          <div className="input-group">
            <input
              type="password"
              name="pin"
              value={otpData.pin}
              onChange={handleOtpChange}
              placeholder="Enter your 4-digit PIN"
              maxLength="4"
            />
          </div>
          <p style={{color: 'var(--secondary-text)', fontSize: '0.875rem', marginTop: '0.5rem'}}>
            Enter the PIN associated with your card
          </p>
        </div>
      )}

      <button 
        type="submit" 
        className="login-button mt-2"
        disabled={
          isLoading || 
          (verificationType === 'otp' && (!otpData.emailOtp || !otpData.smsOtp)) ||
          (verificationType === 'pin' && !validatePin(otpData.pin))
        }
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );

  // Render Step 3: User ID Creation
  const renderUserIdCreation = () => (
    <form onSubmit={handleUserIdAction}>
      <div className="login-error-message success">
        <span>✓ Verification successful!</span>
      </div>

      <div className="form-field">
        <label>Create User ID</label>
        <div className="input-group">
          <input
            type="text"
            value={userIdData.userId}
            onChange={handleUserIdChange}
            placeholder="Enter your desired User ID"
            minLength="3"
          />
          {userIdData.isChecking && (
            <span className="input-icon">⏳</span>
          )}
          {userIdData.isAvailable === true && (
            <span className="input-icon" style={{color: 'green'}}>✓</span>
          )}
          {userIdData.isAvailable === false && (
            <span className="input-icon" style={{color: 'red'}}>✗</span>
          )}
        </div>
        {userIdData.isAvailable === true && (
          <div className="error-message" style={{color: 'green'}}>
            User ID is available! Click "Continue to Security Questions" to proceed.
          </div>
        )}
        {userIdData.isAvailable === false && (
          <div className="error-message">
            User ID is not available. Please try another.
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="login-button"
        disabled={isLoading || !userIdData.userId || userIdData.userId.length < 3}
      >
        {isLoading && userIdData.isChecking && 'Checking Availability...'}
        {isLoading && !userIdData.isChecking && 'Creating User ID...'}
        {!isLoading && userIdData.isAvailable !== true && 'Check Availability'}
        {!isLoading && userIdData.isAvailable === true && 'Continue to Security Questions'}
      </button>
    </form>
  );

  // Render Step 4: Security Questions Creation
  const renderSecurityQuestions = () => (
    <form onSubmit={handleSecurityQuestionsSubmit}>
      <div className="login-error-message success">
        <span>✓ User ID created successfully!</span>
      </div>

      <div className="form-field">
        <label>Security ID</label>
        <div className="input-group">
          <input
            type="text"
            value={securityQuestionsData.securityId}
            readOnly
            className="readonly-input"
            style={{ backgroundColor: '#f5f5f5', color: '#666' }}
          />
        </div>
      </div>

      <div className="security-questions-container">
        <div className="security-questions-header">
          <h3>Security Questions (Answer all 3)</h3>
          <button 
            type="button" 
            className="resend-button"
            onClick={handleSecurityQuestionsReset}
            disabled={isLoading}
          >
            Reset All Questions
          </button>
        </div>

        {securityQuestionsData.questions.map((question, index) => (
          <div key={index} className="security-question-group">
            <h4>Question {index + 1}</h4>
            
            <div className="form-field">
              <label>Security Question Type</label>
              <div className="input-group">
                <select
                  value={question.type}
                  onChange={(e) => handleSecurityQuestionChange(index, 'type', e.target.value)}
                  className="login-dob"
                >
                  <option value="">Select Question Type</option>
                  {securityQuestionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Security Question</label>
              <div className="input-group">
                <select
                  value={question.question}
                  onChange={(e) => handleSecurityQuestionChange(index, 'question', e.target.value)}
                  className="login-dob"
                  disabled={!question.type}
                >
                  <option value="">Select Security Question</option>
                  {question.type && securityQuestionsByType[question.type]?.map(q => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Your Answer</label>
              <div className="input-group">
                <input
                  type="text"
                  value={question.answer}
                  onChange={(e) => handleSecurityQuestionChange(index, 'answer', e.target.value)}
                  placeholder="Enter your answer"
                  disabled={!question.question}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="submit" 
        className="login-button"
        disabled={isLoading || securityQuestionsData.questions.filter(q => q.type && q.question && q.answer.trim()).length !== 3}
      >
        {isLoading ? 'Saving Security Questions...' : 'Continue to Security Images'}
      </button>
    </form>
  );

  // Render Step 5: Security Images Creation
  const renderSecurityImages = () => (
    <div>
      <div className="login-error-message success">
        <span>✓ Security questions saved successfully!</span>
      </div>

      <div className="form-field">
        <label>Security ID</label>
        <div className="input-group">
          <input
            type="text"
            value={securityImagesData.securityId}
            readOnly
            className="readonly-input"
            style={{ backgroundColor: '#f5f5f5', color: '#666' }}
          />
        </div>
      </div>

      <div className="security-images-container">
        <div className="security-images-header">
          <h3>Security Images (Upload exactly 3 images)</h3>
          <p>Images uploaded: {securityImagesData.images.length}/3</p>
        </div>

        {securityImagesData.images.length < 3 && (
          <div className="image-upload-section">
            <h4>Add New Image</h4>
            <form onSubmit={handleAddImageToTable}>
              <div className="form-field">
                <label>Choose Image</label>
                <div className="input-group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                    required
                  />
                </div>
              </div>

              {securityImagesData.currentImage.url && (
                <div className="form-field">
                  <label>Image Preview</label>
                  <div className="input-group">
                    <img 
                      src={securityImagesData.currentImage.url} 
                      alt="Preview"
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              )}

              <div className="form-field">
                <label>Image Type</label>
                <div className="input-group">
                  <select
                    value={securityImagesData.currentImage.type}
                    onChange={(e) => handleCurrentImageUpdate('type', e.target.value)}
                    className="login-dob"
                    required
                  >
                    <option value="">Select Image Type</option>
                    {imageTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>About Image</label>
                <div className="input-group">
                  <input
                    type="text"
                    value={securityImagesData.currentImage.description}
                    onChange={(e) => handleCurrentImageUpdate('description', e.target.value)}
                    placeholder="Describe this image (e.g., 'My favorite sunset', 'Family vacation photo')"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={!securityImagesData.currentImage.file || !securityImagesData.currentImage.type || !securityImagesData.currentImage.description.trim()}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Add Image to Table
              </button>
            </form>
          </div>
        )}

        {securityImagesData.images.length > 0 && (
          <div className="uploaded-images-table">
            <h4>Uploaded Images</h4>
            <table className="images-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Image Type</th>
                  <th>About Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {securityImagesData.images.map((image, index) => (
                  <tr key={image.id}>
                    <td>
                      <img 
                        src={image.url} 
                        alt={`Security ${index + 1}`}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>
                      <span style={{ color: 'var(--primary-text)' }}>
                        {imageTypes.find(type => type.value === image.type)?.label || image.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--primary-text)' }}>
                        {image.description}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.id)}
                        className="delete-button"
                        style={{ 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          padding: '5px 10px', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button 
        onClick={handleSecurityImagesSubmit}
        className="login-button"
        disabled={isLoading || securityImagesData.images.length !== 3}
        style={{ marginTop: '2rem' }}
      >
        {isLoading ? 'Completing Registration...' : 'Complete Registration'}
      </button>
    </div>
  );

  return (
    <div>
      <div className="login-header">
        <h2>
          {currentStep === 1 && 'Card Registration'}
          {currentStep === 2 && (verificationType === 'otp' ? 'OTP Verification' : 'PIN Verification')}
          {currentStep === 3 && 'Create User ID'}
          {currentStep === 4 && 'Security Questions'}
          {currentStep === 5 && 'Security Images'}
        </h2>
        <p>
          {currentStep === 1 && 'Enter your card details to proceed'}
          {currentStep === 2 && (verificationType === 'otp' ? 'Verify your identity with OTP' : 'Enter your card PIN')}
          {currentStep === 3 && 'Create your unique User ID'}
          {currentStep === 4 && 'Answer security questions'}
          {currentStep === 5 && 'Upload security images'}
        </p>
      </div>

      {currentStep === 1 && renderCardDetailsForm()}
      {currentStep === 2 && renderVerification()}
      {currentStep === 3 && renderUserIdCreation()}
      {currentStep === 4 && renderSecurityQuestions()}
      {currentStep === 5 && renderSecurityImages()}

      <div className="form-actions">
        {currentStep === 1 && (
          <button 
            type="button" 
            className="login-tab-button active"
            onClick={() => handleCancel()}
          >
            ← Back
          </button>
        )}
        
        {currentStep > 1 && <button 
          type="button" 
          className="login-tab-button active"
          onClick={handleCancel}
        >
          Cancel & Start Over
        </button>}
      </div>
      
      <RegistrationSuccessModal 
        isVisible={showSuccessModal}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default DebitOrCreditCard 