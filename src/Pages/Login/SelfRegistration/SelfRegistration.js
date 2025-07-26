import React, { useState, useEffect } from 'react'
import './SelfRegistration.css'
import AccountOrCustomerNo from './AccountOrCustomerNo'
import DebitOrCreditCard from './DebitOrCreditCard'
import { useScrollContainerToTop } from '../../../hooks/useScrollToTop';
const SelfRegistration = ({setShowRegister}) => {
    const [loginType, setLoginType] = useState("Account / Customer No");
    const scrollContainerToTop = useScrollContainerToTop()
useEffect(() => {
  scrollContainerToTop('.login-form-section');
}, [loginType, scrollContainerToTop]);
    return (
        <div>
            <div className="login-header">
                <h2>Choose your Registration Method</h2>
                {/* <p>Choose your Registration Method</p> */}
            </div>
            <div className="login-form-container">
                <div className='login-form-container'>
                    <div className="login-type-tabs">
                        {["Account / Customer No", "Debit / Credit Card"].map((type) => (
                            <button
                                key={type}
                                className={`login-tab-button ${loginType === type ? 'active' : ''}`}
                                onClick={() => setLoginType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    {loginType === "Account / Customer No" &&  <AccountOrCustomerNo setShowRegister={setShowRegister}/>}
                    {loginType === "Debit / Credit Card" && <DebitOrCreditCard  setShowRegister={setShowRegister}/>}
                </div>
            </div>
        </div>
    )
}

export default SelfRegistration
