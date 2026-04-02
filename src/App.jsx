import React, { useState } from 'react';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import { useFinance } from './context/FinanceContext';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { loading } = useFinance();

  if (loading) {
    return (
      <div className="layout-container" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center'}}>
           <h2 style={{color: 'var(--text-main)'}}>Loading Financial Data...</h2>
           <p style={{color: 'var(--text-muted)'}}>Simulating API Connection</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' ? <Dashboard /> : <Transactions />}
    </Layout>
  );
}

function App() {
  return <AppContent />;
}

export default App;
