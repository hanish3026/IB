// Sample account data (replace with dynamic data from API)
export const accountData = {
    type: 'Savings Account',
    number: 'XXXX XXXX 5678',
    holderName: 'Hanish',
    branch: 'Downtown Branch',
    ifscCode: 'BANK0001234',
    status: 'Active',
    availableBalance: 45000,
    totalBalance: 45500,
    pendingTransactions: 500,
    recentTransactions: [
        { id: 'T001', date: '2025-03-01', description: 'UPI Transfer to Amazon', amount: -2500, type: 'debit', category: 'Shopping', status: 'completed' },
        { id: 'T002', date: '2025-02-28', description: 'Salary Credit', amount: 75000, type: 'credit', category: 'Income', status: 'completed' },
        { id: 'T003', date: '2025-02-25', description: 'ATM Withdrawal', amount: -10000, type: 'debit', category: 'Withdrawal', status: 'completed' },
        { id: 'T004', date: '2025-02-22', description: 'Electricity Bill Payment', amount: -3500, type: 'debit', category: 'Bills', status: 'completed' },
        { id: 'T005', date: '2025-02-20', description: 'Rent Payment', amount: -20000, type: 'debit', category: 'Housing', status: 'completed' }
    ],
    linkedCards: [
        { id: 'C001', type: 'Debit Card', number: '**** **** **** 1234', expiryDate: '12/26', status: 'Active' },
        { id: 'C002', type: 'Credit Card', number: '**** **** **** 5678', expiryDate: '10/27', status: 'Active' }
    ],
    fixedDeposits: [
        { id: 'FD001', amount: 100000, interestRate: 6.5, maturityDate: '2026-03-15', status: 'Active' }
    ],
    loans: [
        { id: 'L001', type: 'Personal Loan', amount: 250000, outstandingAmount: 150000, emi: 15000, nextPaymentDate: '2025-03-15' }
    ],
    beneficiaries: [
        { id: 'B001', name: 'Hanish Stark', accountNumber: 'XXXX XXXX 9876', ifsc: 'BANK0005678', bankName: 'ABC Bank' },
        { id: 'B002', name: 'Sam Smith', accountNumber: 'XXXX XXXX 4321', ifsc: 'BANK0008765', bankName: 'XYZ Bank' }
    ],
    chequeServices: {
        pendingCheques: 2,
        lastChequeBookRequest: '2025-01-15'
    }
};