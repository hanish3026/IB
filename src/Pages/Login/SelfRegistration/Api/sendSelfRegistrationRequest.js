import axios from 'axios';
import { buildSelfRegistrationPayload } from '../../../../utils/SelfRegistarion';
import LoginApis from '../../Api/LoginApis';

export const sendSelfRegistrationRequest = async (regType, regIdentifier, customerData) => {
  const payload = buildSelfRegistrationPayload({
    regType: regType, // e.g. 'TOPUP'
    regIdentifier: regIdentifier,
    customerData: customerData,
  });
  let token = "";
  LoginApis.getToken().then((response) => { 
     token = response.token
     console.log("token", token);
  });
  try {
    const res = await axios.post('http://localhost:8081/Portal/register', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Version': '1.0',
        'ChannelID': 'IB',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Payment Success:', res.data);
    return res.data;
  } catch (error) {
    sessionStorage.getItem('token');
    console.error('Payment Error:', error.response?.data || error.message);
    throw error;
  }
};
