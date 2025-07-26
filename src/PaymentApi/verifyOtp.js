import axios from 'axios';

/**
 * Verifies an OTP for a given operation
 * @param {string} otpValue - The OTP entered by the user
 * @param {string} otpRefId - The reference ID received when requesting the OTP
 * @param {string} identifier - Account identifier (account number, wallet ID, etc.)
 * @param {string} identifierType - Type of identifier (BANK, WALLET, etc.)
 * @returns {Promise} Promise resolving to verification response
 */
export const verifyOtp = async (
  otpValue,
  otpRefId,
  identifier,
  identifierType = 'BANK'
) => {
  const payload = {
    reqdetails: {
      paytype: "EXIM-AGENCY",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase(),
      reqrefid: String(Math.floor(Date.now() / 1000)),
      initiatedby: "AGT2024103000001",
      primaryarg: {
        serviceid: "AG001",
        agentid: "AGT2024103000001",
        verify: {
          paytype: "OTP",
          reqrefid: otpRefId,
          otp: otpValue,
          identifier,
          identifiertype: identifierType
        }
      }
    }
  };
  
  console.log("OTP verification payload:", payload);
  
  // For development/testing, return mock response based on OTP value
  // In this example, "123456" is the valid OTP
  if (otpValue === "123456") {
    return {
      "reqdetails": {
        "status": "success",
        "message": "OTP verified successfully",
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Mock token
        "expiresIn": "3600" // seconds
      }
    };
  } else {
    return {
      "reqdetails": {
        "status": "failed",
        "message": "Invalid OTP. Please try again.",
        "remainingAttempts": "2"
      }
    };
  }
  
  // Uncomment below to make actual API call
  // try {
  //   const res = await axios.post('https://your-api-url.com/verify-otp', payload, {
  //     headers: {
  //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //
  //   console.log('OTP Verification Success:', res.data);
  //   return res.data;
  // } catch (error) {
  //   console.error('OTP Verification Error:', error.response?.data || error.message);
  //   throw error;
  // }
}; 