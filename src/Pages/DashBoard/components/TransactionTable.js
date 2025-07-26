import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/TransactionTable.css"
import { useTranslation } from 'react-i18next';
  const TransactionTable = () => {
  const { t } = useTranslation('transactiontable');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "descending" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample transactions data
  const transactions = [
    { id: "T001", date: "2025-01-28", description: "Grocery Shopping", amount: "TZS 150.00", status: "Completed" },
    { id: "T002", date: "2025-01-27", description: "Electricity Bill", amount: "TZS 75.00", status: "Cancelled" },
    { id: "T003", date: "2025-01-26", description: "Online Subscription", amount: "TZS 12.99", status: "Completed" },
    { id: "T004", date: "2025-01-25", description: "Movie Tickets", amount: "TZS 45.00", status: "Cancelled" },
    { id: "T005", date: "2025-02-03", description: "Grocery Shopping", amount: "TZS 150.00", status: "Completed" },
    { id: "T006", date: "2025-02-07", description: "Electricity Bill", amount: "TZS 75.00", status: "Cancelled" },
    { id: "T007", date: "2025-02-08", description: "Online Subscription", amount: "TZS 12.99", status: "Completed" },
    { id: "T008", date: "2025-02-09", description: "Movie Tickets", amount: "TZS 45.00", status: "Cancelled" },
  ];

  // Convert string amount to number for sorting
  const getAmountValue = (amountStr) => {
    return parseFloat(amountStr.replace('TZS', ''));
  };

  // Sort function
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === 'amount') {
      const aValue = getAmountValue(a[sortConfig.key]);
      const bValue = getAmountValue(b[sortConfig.key]);
      
      if (sortConfig.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    } else {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
  });

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter transactions based on all criteria
  const filteredTransactions = sortedTransactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // Date filter
    if (start && txnDate < start) return false;
    if (end && txnDate > end) return false;
    
    // Status filter
    if (statusFilter !== "All" && txn.status !== statusFilter) return false;
    
    // Search term filter
    if (searchTerm && !txn.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !txn.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Calculate transaction summary
  const totalAmount = filteredTransactions.reduce((total, txn) => {
    if (txn.status === "Completed") {
      return total + getAmountValue(txn.amount);
    }
    return total;
  }, 0);
console.log(totalAmount)
  // Function to export data as CSV
  const handleDownload = () => {
    // Create CSV content
    let csvContent = "ID,Date,Description,Amount,Status\n";
    
    filteredTransactions.forEach(txn => {
      const row = [
        txn.id,
        txn.date,
        `"${txn.description}"`, // Escape description in case it contains commas
        txn.amount,
        txn.status
      ].join(",");
      csvContent += row + "\n";
    });
    
    // Create a blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset all filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="transaction-container">
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-grid">
          <div className="filter-item">
            <label htmlFor="startDate">{t('from')}</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label htmlFor="endDate">{t('to')}</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {/* <div className="filter-item">
            <label htmlFor="statusFilter">Status</label>
            <select 
              id="statusFilter" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div> */}
          <div className="filter-item">
            <label htmlFor="searchTerm">{t('search')}</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-actions">
          <button onClick={resetFilters} className="btn-reset">
            {t('resetFilters')}
          </button>
          <button onClick={handleDownload} className="btn-download">
            {t('downloadCSV')}
          </button>
        </div>
      </div>
    
      {/* Transaction Summary */}
      <div className="transaction-summary">
        <div className="summary-card">
          <div className="summary-icon total">
            <i className="fas fa-exchange-alt"></i>
          </div>
          <div className="summary-info">
            <span>{t('totalTransactions')}</span>
            <h3>{filteredTransactions.length}</h3>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="summary-info">
            <span>{t('completed')}</span>
            <h3>{filteredTransactions.filter(t => t.status === "Completed").length}</h3>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon cancelled">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="summary-info">
            <span>{t('cancelled')}</span>
            <h3>{filteredTransactions.filter(t => t.status === "Cancelled").length}</h3>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon amount">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="summary-info">
            <span>{t('totalAmount')}</span>
            <h3>TZS {totalAmount.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    
      {/* Table Section */}
      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              {["id", "date", "description", "amount", "status"].map((column) => (
                <th 
                  key={column}
                  onClick={() => requestSort(column)}
                  className={sortConfig.key === column ? 'active' : ''}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  <span className="sort-indicator">
                    {sortConfig.key === column && (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((txn) => (
                <tr key={txn.id}>
                  <td>{txn.id}</td>
                  <td>{txn.date}</td>
                  <td>{txn.description}</td>
                  <td className="amount">{txn.amount}</td>
                  <td>
                    <span className={`status-badge ${txn.status.toLowerCase()}`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  {t('noTransactionsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    
      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            {t('showing')} {indexOfFirstItem + 1} {t('to')} {Math.min(indexOfLastItem, filteredTransactions.length)} {t('of')} {filteredTransactions.length} {t('entries')}
          </div>
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              {t('previous')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
                {t('next')}
            </button>
          </div>
        </div>
      )}
    </div>
);
};

export default TransactionTable;