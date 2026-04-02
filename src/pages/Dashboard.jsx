import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Calendar } from 'lucide-react';
import './Dashboard.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};

const formatMonthDropdown = (monthStr) => {
  if (monthStr === 'all') return 'All Time';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const Dashboard = () => {
  const { summary: globalSummary, transactions } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState('all');

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthStr);
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const dashboardTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter(tx => {
      const d = new Date(tx.date);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return monthStr === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const summary = useMemo(() => {
    if (selectedMonth === 'all') return globalSummary;
    const totalIncome = dashboardTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = dashboardTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense
    };
  }, [dashboardTransactions, globalSummary, selectedMonth]);

  // Process data for charts
  const processTrendData = () => {
    // Sort transactions by date
    const sorted = [...dashboardTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let balance = 0;
    const data = [];
    const groupedByDate = {};

    sorted.forEach(tx => {
      if (!groupedByDate[tx.date]) {
        groupedByDate[tx.date] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') groupedByDate[tx.date].income += tx.amount;
      else groupedByDate[tx.date].expense += tx.amount;
    });

    for (const date in groupedByDate) {
      balance += groupedByDate[date].income - groupedByDate[date].expense;
      data.push({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: balance,
        income: groupedByDate[date].income,
        expense: groupedByDate[date].expense
      });
    }
    return data.length > 0 ? data : [{ date: 'Today', balance: 0, income: 0, expense: 0 }];
  };

  const processCategoryData = () => {
    const categories = {};
    dashboardTransactions.filter(tx => tx.type === 'expense').forEach(tx => {
      categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
    });
    
    return Object.keys(categories)
      .map(key => ({ name: key, value: categories[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5 categories
  };

  const trendData = processTrendData();
  const categoryData = processCategoryData();
  
  // Calculate insights
  const highestCategory = categoryData[0] || { name: 'None', value: 0 };
  const PIE_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Monthly Comparison Insight
  const targetDate = selectedMonth === 'all' ? new Date() : new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]) - 1, 1);
  const currentMonth = targetDate.getMonth();
  const currentMonthYear = targetDate.getFullYear();
  const currentMonthExpenses = transactions
    .filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentMonthYear && tx.type === 'expense';
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentMonthYear - 1 : currentMonthYear;
  const lastMonthExpenses = transactions
    .filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear && tx.type === 'expense';
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyDiff = currentMonthExpenses - lastMonthExpenses;

  return (
    <div className="dashboard-container">
      {/* Dashboard Header / Filter */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Time Period:</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="filter-select glass"
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', minWidth: '150px' }}
          >
            <option value="all">All Time</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{formatMonthDropdown(m)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card balance-card">
          <div className="card-header">
            <h3 className="card-title">Total Balance</h3>
            <div className="icon-wrapper bg-blue"><Wallet size={20} /></div>
          </div>
          <div className="card-amount">{formatCurrency(summary.totalBalance)}</div>
          <div className="card-subtitle">
            {selectedMonth === 'all' ? 'Current estimated balance' : `Estimated balance for ${formatMonthDropdown(selectedMonth)}`}
          </div>
        </div>
        
        <div className="summary-card income-card">
          <div className="card-header">
            <h3 className="card-title">Income</h3>
            <div className="icon-wrapper bg-green"><TrendingUp size={20} /></div>
          </div>
          <div className="card-amount text-success">{formatCurrency(summary.totalIncome)}</div>
          <div className="card-subtitle">
            {selectedMonth === 'all' ? '+ From beginning of time' : `+ For ${formatMonthDropdown(selectedMonth)}`}
          </div>
        </div>

        <div className="summary-card expense-card">
          <div className="card-header">
            <h3 className="card-title">Expenses</h3>
            <div className="icon-wrapper bg-red"><TrendingDown size={20} /></div>
          </div>
          <div className="card-amount text-danger">{formatCurrency(summary.totalExpense)}</div>
          <div className="card-subtitle">
            {selectedMonth === 'all' ? '- From beginning of time' : `- For ${formatMonthDropdown(selectedMonth)}`}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card trend-chart glass">
          <h3 className="chart-title">Balance Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-color)' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card category-chart glass">
          <h3 className="chart-title">Top Expenses</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'var(--border-color)', opacity: 0.4}}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card income-vs-expense-chart glass">
          <h3 className="chart-title">Income vs Expenses</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card expense-breakdown-chart glass">
          <h3 className="chart-title">Expense Breakdown</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section glass">
        <h3 className="section-title">Key Insights</h3>
        <div className="insights-list">
          <div className="insight-item">
            <div className="insight-icon bg-purple"><DollarSign size={20} /></div>
            <div className="insight-content">
              <h4>Highest Spending Category</h4>
              <p>You spent the most on <strong>{highestCategory.name}</strong> ({formatCurrency(highestCategory.value)}).</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon bg-blue"><TrendingUp size={20} /></div>
            <div className="insight-content">
              <h4>Savings Rate</h4>
              <p>Your current savings rate is <strong>{summary.totalIncome > 0 ? Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100) : 0}%</strong> of your income.</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon bg-red"><Calendar size={20} /></div>
            <div className="insight-content">
              <h4>Monthly Comparison</h4>
              <p>
                {lastMonthExpenses > 0 
                  ? `Your expenses this month are ${formatCurrency(Math.abs(monthlyDiff))} ${monthlyDiff > 0 ? 'higher' : 'lower'} than last month.` 
                  : `You spent ${formatCurrency(currentMonthExpenses)} this month. Need more data to compare with last month.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
