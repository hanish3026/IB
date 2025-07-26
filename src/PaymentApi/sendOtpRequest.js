import axios from 'axios';
import { buildOtpPayload } from '../utils/buildOtpPayload';
export const sendOtpRequest = async (
  identifier, 
  identifierType, 
  payFor,
  triggerType
) => {
  const payload = buildOtpPayload({
    identifier,
    identifierType,
    payFor,
    triggerType
  });
  
  console.log("OTP request payload:", payload);
  
  // For development/testing, return mock response
  return {
    "resdetails": {
        "paytype": "EXIM-AGENCY",
        "date": "22-jan-2025",
        "reqrefid": "187654321000",
        "initiatedby": "AGT2024103000001",
        "primaryarg": {
            "serviceid": "AG001",
            "agentid": "AGT2024103000001",
            "reqfid": "1737543864959"
        }
    },
    "result": "success",
    "stscode": "AB000",
    "message": "nous avons généré un OTP sur votre identifiant e-mail enregistré et votre numéro de téléphone portable"
}
  // Uncomment below to make actual API call
  // try {
  //   const res = await axios.post('https://your-api-url.com/otp', payload, {
  //     headers: {
  //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //
  //   console.log('OTP Request Success:', res.data);
  //   return res.data;
  // } catch (error) {
  //   console.error('OTP Request Error:', error.response?.data || error.message);
  //   throw error;
  // }
}; 