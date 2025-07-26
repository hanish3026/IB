import React, { useState } from 'react';
import "../css/ReportCard.css";

const ReportCard = ({ setModule }) => {
  // Sample data for report card
  const [statements, setStatements] = useState([
    {
      id: 1,
      period: 'Jan 2025',
      accountNumber: '**** 5678',
      accountType: 'Savings',
      generatedDate: '01/31/2025',
      downloadUrl: '#',
      size: '235 KB'
    },
    {
      id: 2,
      period: 'Dec 2024',
      accountNumber: '**** 5678',
      accountType: 'Savings',
      generatedDate: '12/31/2024',
      downloadUrl: '#',
      size: '198 KB'
    },
    {
      id: 3,
      period: 'Nov 2024',
      accountNumber: '**** 5678',
      accountType: 'Savings',
      generatedDate: '11/30/2024',
      downloadUrl: '#',
      size: '215 KB'
    },
    {
      id: 4,
      period: 'Oct 2024',
      accountNumber: '**** 7890',
      accountType: 'Current',
      generatedDate: '10/31/2024',
      downloadUrl: '#',
      size: '242 KB'
    },
    {
      id: 5,
      period: 'Sep 2024',
      accountNumber: '**** 7890',
      accountType: 'Current',
      generatedDate: '09/30/2024',
      downloadUrl: '#',
      size: '187 KB'
    }
  ]);
console.log(setStatements);
  // State for filter options
  const [filters, setFilters] = useState({
    accountType: 'all',
    period: 'last6',
    searchQuery: ''
  });

  // State for the statement being viewed
  const [selectedStatement, setSelectedStatement] = useState(null);
  
  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Filtered statements based on current filters
  const filteredStatements = statements.filter(statement => {
    // Filter by account type
    if (filters.accountType !== 'all' && statement.accountType.toLowerCase() !== filters.accountType) {
      return false;
    }
    
    // Filter by search query
    if (filters.searchQuery && 
        !statement.period.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !statement.accountNumber.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by time period
    const statementDate = new Date(statement.generatedDate);
    const currentDate = new Date();
    
    if (filters.period === 'last3') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      if (statementDate < threeMonthsAgo) {
        return false;
      }
    } else if (filters.period === 'last6') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
      if (statementDate < sixMonthsAgo) {
        return false;
      }
    } else if (filters.period === 'last12') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
      if (statementDate < oneYearAgo) {
        return false;
      }
    }
    
    return true;
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Handle statement selection for viewing
  const handleViewStatement = (statement) => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setSelectedStatement(statement);
      setIsLoading(false);
    }, 1000);
  };

  // Handle statement download
  const handleDownloadStatement = (id) => {
    setDownloadingId(id);
    
    // Simulate download process
    setTimeout(() => {
      setDownloadingId(null);
      // In a real implementation, this would trigger the actual file download
      alert('Statement download started.');
    }, 1500);
  };

  // Go back to overview
  const handleBack = () => {
    setModule("CardOverview");
  };

  // Handle closing the statement view
  const handleCloseStatement = () => {
    setSelectedStatement(null);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      searchQuery: e.target.value
    }));
  };

  return (
    <div className="wallet-container wallet-section">
      <div className="wallet-card wallet-fade-in">
        <div className="wallet-card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Account Statements</h5>
          <button className="btn btn-link" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
        
        <div className="wallet-card-body">
          {selectedStatement ? (
            <div className="statement-viewer">
              <div className="statement-viewer-header">
                <h6>{selectedStatement.period} Statement - {selectedStatement.accountType} Account {selectedStatement.accountNumber}</h6>
                <button className="btn btn-link" onClick={handleCloseStatement}>
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="statement-viewer-content">
                <div className="statement-preview-placeholder">
                  <div className="statement-logo">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                  </div>
                  <h5>ACCOUNT STATEMENT</h5>
                  <p className="statement-period">{selectedStatement.period}</p>
                  <div className="statement-details">
                    <div className="statement-detail-item">
                      <span className="detail-label">Account:</span>
                      <span className="detail-value">{selectedStatement.accountType} Account {selectedStatement.accountNumber}</span>
                    </div>
                    <div className="statement-detail-item">
                      <span className="detail-label">Generated On:</span>
                      <span className="detail-value">{selectedStatement.generatedDate}</span>
                    </div>
                    <div className="statement-detail-item">
                      <span className="detail-label">File Size:</span>
                      <span className="detail-value">{selectedStatement.size}</span>
                    </div>
                  </div>
                  <div className="statement-preview-message">
                    <p>This is a statement preview. Download the full statement to view all transactions.</p>
                  </div>
                  <button 
                    className="action-button primary mt-3"
                    onClick={() => handleDownloadStatement(selectedStatement.id)}
                    disabled={downloadingId === selectedStatement.id}
                  >
                    {downloadingId === selectedStatement.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-download mr-2"></i> Download Full Statement
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="filter-section wallet-fade-in-delay-1">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Account Type</label>
                        <select 
                          className="form-control"
                          name="accountType"
                          value={filters.accountType}
                          onChange={handleFilterChange}
                        >
                          <option value="all">All Accounts</option>
                          <option value="savings">Savings</option>
                          <option value="current">Current</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Time Period</label>
                        <select 
                          className="form-control"
                          name="period"
                          value={filters.period}
                          onChange={handleFilterChange}
                        >
                          <option value="last3">Last 3 Months</option>
                          <option value="last6">Last 6 Months</option>
                          <option value="last12">Last 12 Months</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Search</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="Search statements..."
                          value={filters.searchQuery}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 d-flex align-items-end justify-content-end">
                    <button className="action-button secondary">
                      <i className="fa-solid fa-envelope mr-2"></i> Email Latest Statement
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="statements-list wallet-fade-in-delay-2">
                {isLoading ? (
                  <div className="loading-spinner-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : filteredStatements.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table statement-table">
                      <thead>
                        <tr>
                          <th>Statement Period</th>
                          <th>Account</th>
                          <th>Generated Date</th>
                          <th>Size</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStatements.map(statement => (
                          <tr key={statement.id}>
                            <td>{statement.period}</td>
                            <td>{statement.accountType} Account {statement.accountNumber}</td>
                            <td>{statement.generatedDate}</td>
                            <td>{statement.size}</td>
                            <td>
                              <div className="statement-actions">
                                <button 
                                  className="action-button sm primary mr-2"
                                  onClick={() => handleViewStatement(statement)}
                                >
                                  <i className="fa-solid fa-eye"></i> View
                                </button>
                                <button 
                                  className="action-button sm secondary"
                                  onClick={() => handleDownloadStatement(statement.id)}
                                  disabled={downloadingId === statement.id}
                                >
                                  {downloadingId === statement.id ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  ) : (
                                    <i className="fa-solid fa-download"></i>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-statements">
                    <div className="no-data-icon">
                      <i className="fa-solid fa-file-circle-xmark"></i>
                    </div>
                    <h6>No statements found</h6>
                    <p>Try adjusting your filters or search query.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;