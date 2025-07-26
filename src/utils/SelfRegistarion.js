export function buildSelfRegistrationPayload({
  payType = "HD_Connect",
  initiatedBy = "ADMIN",
  regType,
  regIdentifier,
  serviceId = "HDC001",
  customerData
}) {
  const reqrefid = String(Math.floor(Date.now() / 1000));
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  
  return {
    request: {
      paytype: payType,
      date,
      reqrefid,
      initiatedby: initiatedBy
    },
    registration: {
      regtype: regType,
      regidentifier: regIdentifier,
      serviceid: serviceId
    },
    customer: {
      firstname: customerData.firstName,
      lastname: customerData.lastName,
      dateofbirth: customerData.dob,
      mobileno: customerData.mobileNumber,
      email: customerData.email,
      gender: customerData.gender
    }
  };
}