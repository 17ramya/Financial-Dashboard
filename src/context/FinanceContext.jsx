import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // Try to load from localStorage, otherwise use initial setup
  const loadState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [transactions, setTransactions] = useState(() => 
    loadState('fin_transactions', initialTransactions)
  );
  
  const [role, setRole] = useState(() => loadState('fin_role', 'admin'));
  const [theme, setTheme] = useState(() => loadState('fin_theme', 'dark'));
  const [loading, setLoading] = useState(true);

  // Mock API integration simulation
  useEffect(() => {
    const fetchMockData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      setLoading(false);
    };
    fetchMockData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_role', JSON.stringify(role));
  }, [role]);

  useEffect(() => {
    localStorage.setItem('fin_theme', JSON.stringify(theme));
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Actions
  const addTransaction = (transaction) => {
    if (role !== 'admin') return;
    const newTx = { ...transaction, id: Date.now().toString() };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };
  
  // Calculate summary stats
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalBalance = totalIncome - totalExpense;

  const value = {
    transactions,
    role,
    setRole,
    theme,
    setTheme,
    addTransaction,
    deleteTransaction,
    loading,
    summary: {
      totalIncome,
      totalExpense,
      totalBalance
    }
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
