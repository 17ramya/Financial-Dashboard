import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { LayoutDashboard, Receipt, Moon, Sun, Shield, ShieldAlert, Wallet } from 'lucide-react';
import './Layout.css';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const { role, setRole, theme, setTheme } = useFinance();

  const handleRoleToggle = () => {
    setRole(role === 'admin' ? 'viewer' : 'admin');
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="layout-container animate-fade-in">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon"><Wallet size={24} /></div>
          <h2>FinDash</h2>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <Receipt size={20} />
            <span>Transactions</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="glass role-info">
            <span className="role-label">Role:</span>
            <span className={`role-badge ${role}`}>{role}</span>
          </div>
        </div>
      </aside>

      <main className="main-content-area">
        <header className="top-header glass">
          <div className="header-title">
            <h1>{activeTab === 'dashboard' ? 'Overview' : 'Transactions'}</h1>
          </div>
          
          <div className="header-actions">
            <button className="action-btn" onClick={handleRoleToggle} title="Toggle Role">
              {role === 'admin' ? <Shield size={20} className="text-success" /> : <ShieldAlert size={20} className="text-warning" />}
              <span className="action-text">{role === 'admin' ? 'Admin' : 'Viewer'}</span>
            </button>
            <button className="action-btn icon-btn" onClick={handleThemeToggle} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
