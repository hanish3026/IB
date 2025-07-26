export function buildOtpPayload({
  initiatedBy = 'AGT2024103000001',
  serviceId = 'AG001',
  agentId = 'AGT2024103000001',
  payFor,
  triggerType,
  identifier,
  identifierType
}) {
  const reqrefid = String(Math.floor(Date.now() / 1000));
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
  
  return {
    reqdetails: {
      paytype: "EXIM-AGENCY",
      date,
      reqrefid,
      initiatedby: initiatedBy,
      primaryarg: {
        serviceid: serviceId,
        agentid: agentId,
        trigger: {
          paytype: "OTP",
          reqrefid,
          payfor: payFor,
          triggertype: triggerType,
          identifier,
          identifiertype: identifierType
        }
      }
    }
  };
} 