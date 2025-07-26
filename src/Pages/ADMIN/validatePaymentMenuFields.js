/**
 * Validates form data for AddPaymentMenu fields.
 * @param {Array} fields - The array of field definitions.
 * @param {Object} formData - The form data object (fieldId: value).
 * @returns {Object} { isValid: boolean, errors: { [fieldId]: errorMessage } }
 */
export function validatePaymentMenuFields(fields, formData) {
  const errors = {};

  fields.forEach(field => {
    const value = formData[field.FIELDID];
    const label = field.LABELNAME;
    const type = field.FIELDTYPE;

    // Required validation (all fields are required for now)
    if (!value || value === '') {
      errors[field.FIELDID] = `${label} is required.`;
      return;
    }

    // Type-specific validation
    if (type === 'N') {
      if (isNaN(value)) {
        errors[field.FIELDID] = `${label} must be a number.`;
      }
    }
    if (type === 'DD') {
      const validOptions = (field.options || []).map(opt => (opt.value !== undefined ? String(opt.value) : String(opt)));
      if (!validOptions.includes(String(value))) {
        errors[field.FIELDID] = `${label} must be a valid option.`;
      }
    }

    // Example: Custom LABELNAME validation
    if (label === 'To Account' && value.length < 10) {
      errors[field.FIELDID] = 'To Account must be at least 10 characters.';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
} 