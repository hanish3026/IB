export function builLookupPayload({
  paytype,
  initiatedBy,
  acno,
  identifiertype,
  bankcode
}) {
  const reqrefid = String(Math.floor(Date.now() / 1000));
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
  
  return {
    aclookup: {
      paytype,
      date,
      reqrefid,
      initiatedby: initiatedBy,
      primaryarg: {
        acno,
        custno : "",
        identifier: acno,
        identifiertype,
        msisdn : "",
        nin : "",
        firstname : "",
        middlename : "",
        lastname : "",
        fullname : "",
        bankcode:bankcode
      }
    }
  };
}
