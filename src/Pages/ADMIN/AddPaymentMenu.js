import React, { useState } from 'react';
import { validatePaymentMenuFields } from './validatePaymentMenuFields';

const AddPaymentMenu = () => {
    const data = {
        "fields": [
            {
                "COLUMNID": "2",
                "FIELDID": "toAccount",
                "LABELNAME": "To Account",
                "FIELDTYPE": "T",
                "HELPREQ": 0,
                "CAPTIONREQ": 1,
                "CAPTION": "Enter your To Account No"
            },
            {
                "COLUMNID": "1",
                "FIELDID": "fromAccount",
                "LABELNAME": "From Account",
                "FIELDTYPE": "T",
                "HELPREQ": 0,
                "CAPTIONREQ": 1,
                "CAPTION": "Enter your From Account No"
            },
            {
                "COLUMNID": "3",
                "FIELDID": "creditAmount",
                "LABELNAME": "Credit Amount",
                "FIELDTYPE": "N",
                "HELPREQ": 0,
                "CAPTIONREQ": 1,
                "CAPTION": "0.00"
            },
            {
                "COLUMNID": "4",
                "FIELDID": "debitAmount",
                "LABELNAME": "Debit Amount",
                "FIELDTYPE": "N",
                "HELPREQ": 0,
                "CAPTIONREQ": 1,
                "CAPTION": "0.00"
            },
            {
                "COLUMNID": "5",
                "FIELDID": "purposeCode",
                "LABELNAME": "Purpose Code",
                "FIELDTYPE": "DD",
                "HELPREQ": 0,
                "CAPTIONREQ": 1,
                "CAPTION": "Select your Purpose Code",
                "options": [
                    {
                        "value": "1",
                        "label": "1"
                    },
                    {
                        "value": "2",
                        "label": "2"
                    }
                ]
            },
            {
                "COLUMNID": "6",
                "FIELDID": "description",
                "LABELNAME": "Description",
                "FIELDTYPE": "T",
                "HELPREQ": 0,
                "CAPTIONREQ": 1,
                "CAPTION": "Enter your description"
            }
        ],
    };

    // Sort fields by COLUMNID (as number)
    const sortedFields = [...data.fields].sort((a, b) => Number(a.COLUMNID) - Number(b.COLUMNID));

    // Initialize form state
    const initialFormData = sortedFields.reduce((acc, field) => {
        acc[field.FIELDID] = '';
        return acc;
    }, {});
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const handleChange = (e, field) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            [field.FIELDID]: value
        });

        // Validate only the changed field
        const singleFieldData = { ...formData, [field.FIELDID]: value };
        const { errors: fieldErrors } = validatePaymentMenuFields([field], singleFieldData);
        setErrors(prev => ({
            ...prev,
            [field.FIELDID]: fieldErrors[field.FIELDID] || ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { isValid, errors: allErrors } = validatePaymentMenuFields(sortedFields, formData);
        setErrors(allErrors);
        if (!isValid) {
            // Prevent submit, errors will be shown
            return;
        }
        // Proceed with form submission
        console.log('Form Data:', formData);
    };

    return (
        <form className="add-payment-menu-form" onSubmit={handleSubmit}>
            {sortedFields.map(field => (
                <div key={field.FIELDID} style={{ marginBottom: '1rem' }}>
                    <label htmlFor={field.FIELDID} style={{ display: 'block', marginBottom: 4 }}>
                        {field.LABELNAME}
                    </label>
                    {field.FIELDTYPE === 'T' && (
                        <input
                            type="text"
                            id={field.FIELDID}
                            name={field.FIELDID}
                            className={`testing-${field.FIELDID}`}
                            value={formData[field.FIELDID]}
                            onChange={e => handleChange(e, field)}
                            placeholder={field.CAPTIONREQ === 1 ? field.CAPTION : ''}
                        />
                    )}
                    {field.FIELDTYPE === 'N' && (
                        <input
                            type="number"
                            id={field.FIELDID}
                            name={field.FIELDID}
                            className={`testing-${field.FIELDID}`}
                            value={formData[field.FIELDID]}
                            onChange={e => handleChange(e, field)}
                            placeholder={field.CAPTIONREQ === 1 ? field.CAPTION : ''}
                        />
                    )}
                    {field.FIELDTYPE === 'DD' && (
                        <select
                            id={field.FIELDID}
                            name={field.FIELDID}
                            className={`testing-${field.FIELDID}`}
                            value={formData[field.FIELDID]}
                            onChange={e => handleChange(e, field)}
                        >
                            <option value="" disabled>{field.CAPTIONREQ === 1 ? field.CAPTION : 'Select an option'}</option>
                            {(field.options && field.options.length > 0) ? (
                                field.options.map(opt => (
                                    <option key={opt.value || opt} value={opt.value || opt}>
                                        {opt.label || opt}
                                    </option>
                                ))
                            ) : null}
                        </select>
                    )}
                    {errors[field.FIELDID] && (
                        <div style={{ color: 'red', fontSize: 12 }}>{errors[field.FIELDID]}</div>
                    )}
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddPaymentMenu;
