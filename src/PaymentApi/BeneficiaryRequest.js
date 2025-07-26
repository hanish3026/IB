import axios from 'axios';
import { BeneficiaryPayload } from '../utils/BeneficiaryPayload';

export const sendBeneficiaryRequest = async (sourcedtl) => {

  const payload = BeneficiaryPayload({ sourcedtl });

  console.log("beneficiary payload", payload, sessionStorage.getItem('token'));
//   return {
//     "resdetails": {
//       "paytype": sourcedtl.PAYTYPE,
//       "date": new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase(),
//       "reqrefid": String(Math.floor(Date.now() / 1000)),
//       "initiatedby": sessionStorage.getItem('userName'),
//       "primaryarg": {
//         "sourcedtl": sourcedtl
//       }
//     },
//     "result": "success",
//     "stscode": "BN000",
//     "message": "beneficiary request processed!"
//   };

//   Uncomment below to make actual API call
  try {
    const res = await axios.post('http://192.168.5.13:9090/HD-CONNECT_LOCAL/add/beneficiary', payload.BeneficiaryPayLoad, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Version': 1.0,
        'ChannelID':'IB'
      },
    });

    console.log('Beneficiary Success:', res.data);
    return res.data;
  } catch (error) {
    console.error('Beneficiary Error:', error.response?.data || error.message);
    throw error;
  }
};