import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Plus, Trash2, ArrowUpRight, ArrowDownRight, Filter, Download } from 'lucide-react';
import './Transactions.css';

const Transactions = () => {
  const { transactions, role, addTransaction, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showAddForm, setShowAddForm] = useState(false);

  // New transaction form state
  const [newTx, setNewTx] = useState({ title: '', amount: '', category: '', type: 'expense', date: new Date().toISOString().split('T')[0] });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTx.title || !newTx.amount || !newTx.category) return;

    addTransaction({
      ...newTx,
      amount: parseFloat(newTx.amount)
    });
    setNewTx({ title: '', amount: '', category: '', type: 'expense', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Amount', 'Category', 'Date', 'Type'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(tx => `${tx.id},"${tx.title}",${tx.amount},"${tx.category}",${tx.date},${tx.type}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.json';
    link.click();
  };

  // Filtering functionality
  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  // Sorting functionality
  const filteredTransactions = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amt-desc') return b.amount - a.amount;
    if (sortBy === 'amt-asc') return a.amount - b.amount;
    return 0;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="transactions-container animate-fade-in">
      {/* Controls Area */}
      <div className="controls-bar glass">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-actions">
          <div className="filter-group">
            <Filter size={18} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amt-desc">Highest Amount</option>
              <option value="amt-asc">Lowest Amount</option>
            </select>
          </div>

          {role === 'admin' && (
            <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={18} />
              <span>Add Transaction</span>
            </button>
          )}

          <button className="btn-secondary" onClick={exportCSV} title="Export CSV">
            <Download size={18} />
            <span>CSV</span>
          </button>
          <button className="btn-secondary" onClick={exportJSON} title="Export JSON">
            <Download size={18} />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Add Transaction Form (Admin Only) */}
      {role === 'admin' && showAddForm && (
        <form className="add-transaction-form glass animate-fade-in" onSubmit={handleAdd}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={newTx.title} onChange={e => setNewTx({ ...newTx, title: e.target.value })} required placeholder="e.g. Salary" />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" step="0.01" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} required placeholder="e.g. 5000" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value })} required>
                <option value="" disabled>Select Category</option>
                {newTx.type === 'expense' ? (
                  <>
                    <option value="Housing">Housing</option>
                    <option value="Income">Income</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>

                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Dining">Dining</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investment">Investment</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Transaction</button>
          </div>
        </form>
      )}

      {/* Transactions Table/List */}
      <div className="transactions-list-container glass">
        {filteredTransactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                {role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="transaction-row">
                  <td>
                    <div className="tx-title-cell">
                      <div className={`tx-icon ${tx.type === 'income' ? 'bg-success-light' : 'bg-danger-light'}`}>
                        {tx.type === 'income' ? <ArrowUpRight size={16} className="text-success" /> : <ArrowDownRight size={16} className="text-danger" />}
                      </div>
                      <span className="tx-title">{tx.title}</span>
                    </div>
                  </td>
                  <td><span className="badge category-badge">{tx.category}</span></td>
                  <td><span className="tx-date">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></td>
                  <td>
                    <span className={`tx-amount ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td>
                      <button className="delete-btn" onClick={() => deleteTransaction(tx.id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
