import React, { useEffect, useState } from 'react';
import PaymentMenuApis from './Api/Payementmenu';
import './PaymentMenu.css';

const PaymentMenu = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);
    // Update formData to include STATUS
    const [formData, setFormData] = useState({
        payment_name_id: '',
        payment_name: '',
        description: '',
        logo: '',
        icon: '',
        status: 1
    });
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        fetchMenuData();
        // Remove formData from dependencies to prevent infinite loop
    }, [refreshData]);

    const fetchMenuData = () => {
        setLoading(true);
        PaymentMenuApis.getTranfermenu(sessionStorage.getItem('token'))
            .then((response) => {
                console.log("PaymentMenu", response);
                if (response && response.Menus) {
                    setMenuData(response.Menus);
                }
            })
            .catch(error => {
                console.error("Error fetching menu data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const showAddModal = () => {
        setModalMode('add');
        setCurrentMenu(null);
        setFormData({
            payment_name_id: '',
            payment_name: '',
            description: '',
            logo: '',
            icon: '',
            status: 1
        });
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setModalMode('edit');
        setCurrentMenu(record);
        setFormData({
            payment_name_id: record.PAYMENT_NAME_ID,
            payment_name: record.PAYMENT_NAME,
            description: record.DESCRIPTION,
            logo: record.LOGO,
            icon: record.ICON,
            status: record.STATUS
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Get the base64 string by removing the data URL prefix
                const base64String = reader.result.split(',')[1];
                setFormData({
                    ...formData,
                    logo: base64String
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.payment_name_id || !formData.payment_name || !formData.description) {
            alert('Please fill all required fields');
            return;
        }

        if (modalMode === 'add') {
            // Here you would call an API to add a new menu item
            console.log("Adding new menu item:", formData);
            // Convert lowercase keys to uppercase for display in the table
            const newItem = {
                PAYMENT_NAME_ID: formData.payment_name_id,
                PAYMENT_NAME: formData.payment_name,
                DESCRIPTION: formData.description,
                LOGO: formData.logo,
                ICON: formData.icon,
                key: Date.now().toString()
            };
            setMenuData([...menuData, newItem]);
        } else {
            // Here you would call an API to update the menu item
            console.log("Updating menu item:", formData);
            PaymentMenuApis.updateMenus(sessionStorage.getItem('token'), formData)
               .then((response) => {
                    console.log("Menu updated successfully:", response);
                })
               .catch(error => {
                    console.error("Error updating menu:", error);
                });
            const updatedData = menuData.map(item => 
                item.PAYMENT_NAME_ID === currentMenu.PAYMENT_NAME_ID ? {
                    ...item,
                    PAYMENT_NAME_ID: formData.payment_name_id,
                    PAYMENT_NAME: formData.payment_name,
                    DESCRIPTION: formData.description,
                    LOGO: formData.logo,
                    ICON: formData.icon
                } : item
            );
            setMenuData(updatedData);
        }
        setIsModalVisible(false);
        // Trigger a refresh of the data
        setRefreshData(prev => !prev);
    };

    const handleDelete = (record) => {
        // Here you would call an API to delete the menu item
        if (window.confirm(`Are you sure you want to delete ${record.PAYMENT_NAME}?`)) {
            console.log("Deleting menu item:", record);
            // For now, just remove it from the local state
            const filteredData = menuData.filter(item => item.PAYMENT_NAME_ID !== record.PAYMENT_NAME_ID);
            setMenuData(filteredData);
            // Trigger a refresh of the data
            setRefreshData(prev => !prev);
        }
    };

    const handleToggleStatus = (record) => {
        const token = sessionStorage.getItem('token');
        const currentStatus = record.STATUS;
        
        PaymentMenuApis.toggleStatus(token, record.PAYMENT_NAME_ID, currentStatus)
            .then(response => {
                console.log("Status toggled successfully:", response);
                // Update the local state
                const updatedData = menuData.map(item => 
                    item.PAYMENT_NAME_ID === record.PAYMENT_NAME_ID 
                        ? { ...item, STATUS: currentStatus === 1 ? 0 : 1 } 
                        : item
                );
                setMenuData(updatedData);
            })
            .catch(error => {
                console.error("Error toggling status:", error);
                alert("Failed to toggle status. Please try again.");
            });
    };

    return (
        <div className="payment-menu-container">
            <div className="payment-menu-header">
                <h1>Payment Menu Management</h1>
                <button 
                    className="btn btn-primary add-btn"
                    onClick={showAddModal}
                >
                    <i className="fas fa-plus"></i> Add New Payment Method
                </button>
            </div>
            
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Payment ID</th>
                            <th>Payment Name</th>
                            <th>Description</th>
                            <th>Icon</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuData.map(item => (
                            <tr key={item.PAYMENT_NAME_ID} className={item.STATUS === 0 ? "inactive-row" : ""}>
                                <td>
                                    <img 
                                        src={`data:image/png;base64,${item.LOGO}`} 
                                        alt="Logo" 
                                        className="payment-logo" 
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            // Use a data URI instead of an external placeholder
                                            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%3E%3Crect%20width%3D%2250%22%20height%3D%2250%22%20fill%3D%22%23cccccc%22%2F%3E%3Ctext%20x%3D%2225%22%20y%3D%2225%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23333333%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                                        }}
                                    />
                                </td>
                                <td>{item.PAYMENT_NAME_ID}</td>
                                <td>{item.PAYMENT_NAME}</td>
                                <td>{item.DESCRIPTION}</td>
                                <td><i className={`fas ${item.ICON}`}></i></td>
                                <td className="status-toggle">
                                    <label className="switch">
                                        <input 
                                            type="checkbox" 
                                            checked={item.STATUS === 1} 
                                            onChange={() => handleToggleStatus(item)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="status-text">
                                        {item.STATUS === 1 ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <button 
                                        className="btn btn-edit"
                                        onClick={() => showEditModal(item)}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button 
                                        className="btn btn-delete"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{modalMode === 'add' ? 'Add New Payment Method' : 'Edit Payment Method'}</h2>
                            <button className="close-btn" onClick={handleCancel}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="payment-form">
                            <div className="form-group">
                                <label htmlFor="payment_name_id">Payment ID*</label>
                                <input
                                    type="text"
                                    id="payment_name_id"
                                    name="payment_name_id"
                                    value={formData.payment_name_id}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="payment_name">Payment Name*</label>
                                <input
                                    type="text"
                                    id="payment_name"
                                    name="payment_name"
                                    value={formData.payment_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description*</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="logo">Logo Upload*</label>
                                <div className="logo-upload-container">
                                    <input
                                        type="file"
                                        id="logo_UPLOAD"
                                        name="logo_UPLOAD"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="logo-upload-input"
                                    />
                                    {formData.logo && (
                                        <div className="logo-preview">
                                            <img 
                                                src={`data:image/png;base64,${formData.logo}`} 
                                                alt="Logo Preview" 
                                                className="logo-preview-image" 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="icon">Icon Class*</label>
                                <input
                                    type="text"
                                    id="icon"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    placeholder="e.g., fa-exchange-alt"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <div className="status-toggle-form">
                                    <label className="switch">
                                        <input 
                                            type="checkbox" 
                                            id="status"
                                            name="status"
                                            checked={formData.status === 1} 
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                status: e.target.checked ? 1 : 0
                                            })}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="status-text">
                                        {formData.status === 1 ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {modalMode === 'add' ? 'Add' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMenu;