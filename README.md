# FinDash - Finance Dashboard UI

An elegantly designed, highly interactive, and completely responsive Finance Dashboard built using React and Vanilla CSS. It provides a comprehensive visual overview of financial activity, transaction management, and basic simulated role-based access.

## ✨ Core Requirements Implemented

1. **Dashboard Overview**
   - **Summary Cards**: At-a-glance metrics for Total Balance, Total Income, and Total Expenses.
   - **Visualizations**: 
     - *Balance Trend*: Area chart mapping financial flow over time.
     - *Income vs Expenses*: Line chart comparing cash inflows and outflows.
     - *Expense Breakdown*: Categorical Pie chart visualizing spending distributions.
     - *Top Expenses*: Horizontal Bar chart for instant identification of large spending blocks.
   - **Dynamic Time Period Filter**: Users can select specific months using a dropdown (e.g., "October 2023"). The entire dashboard intelligently recalculates all charts, cards, and insights for that explicit time period.

2. **Transactions Section**
   - Clean, tabular data displaying Title, Type (Income/Expense indicator), Date, explicit Categorization badges, and color-coded Amounts.
   - **Filtering**: Isolate transactions by type (All/Income/Expense).
   - **Searching**: Search transactions seamlessly via Title or Category.
   - **Sorting**: Multi-parameter sorting support (Highest/Lowest Amount, Newest/Oldest).

3. **Role-Based UI (Simulated)**
   - **Admin role**: Granted full CRUD capabilities, easily allowing the addition or deletion of specific transaction logs directly via the UI.
   - **Viewer role**: Clean, read-only interface with data manipulation interfaces gracefully removed from the DOM.
   - An intuitive toggle exists on the top-right Header to seamlessly switch roles for testing.

4. **Intelligent Insights Section**
   - Dynamically highlights your **Highest Spending Category**.
   - Calculates your exact **Savings Rate**.
   - Performs a **Monthly Comparison** contextualized by your active time-period filter.

5. **Robust State Management**
   - Centralized state using the **React Context API** (`FinanceContext`).
   - Completely avoids prop drilling while managing application-wide statuses (Active Theme, Active Role, Sandbox Transaction Data, global Loading State).

## 🚀 Optional Enhancements Included

- **Dark & Light Mode** fully supported via CSS variables (Defaulting to Dark mode).
- **Data Persistence**: Transactions, theme picks, and role selection natively persist across browser reloads via `localStorage`.
- **Advanced Exporting**: Natively export sandbox transaction sets natively to `CSV` or `JSON` arrays in a single click.
- **Mock API Implementation**: Simulates real-world application booting with a graceful loading screen and delayed network state logic.
- **Modern Animations**: Subtle entrance animations (`fade-in`) and card-hover scales established to make the UI feel alive.

## 📱 Responsiveness Approach

A flawless mobile-first mindset applied strictly via custom Vanilla CSS (without relying on bloated UI libraries).
- On devices `< 768px`, the left Sidebar natively collapses into a sticky, screen-wide bottom icon navigation bar.
- Flow structures automatically transition their `grid-templates` down to single `1fr` columns.
- Deeply protected flex containers force `min-width: 0` constraints to ensure inner tables overflow internally (with smooth horizontal swipe scrolling) rather than breaking the broader app layout structure. 

## 🛠️ Setup Instructions

To get this dashboard up and running on your local machine:

1. **Clone/Download** the repository.
2. Ensure you are in the project root directory.
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. Open the displayed local URL (typically `http://localhost:5173`) in your browser.

## 🏗️ Technical Architecture & Quality

- **Component Driven**: The codebase separates logical layout wrappers (`Layout.jsx`) from views (`Dashboard.jsx`, `Transactions.jsx`) to enforce clean, readable abstraction. 
- **Vanilla Dependency**: By deliberately ignoring CSS frameworks like Tailwind or Material UI, this demonstrates an absolute core mastery over raw CSS implementations. Includes custom scrollbars, CSS variables logic switching, glassmorphic `backdrop-filter` rendering, and isolated breakpoint logic.
- **Defensive Structuring**: Input forms dynamically alter their respective `select` dropdown options (for Expense vs Income categorization) minimizing potential bad-data entry without complex validation libraries.
