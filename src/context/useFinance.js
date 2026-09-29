import { createContext, useContext } from 'react';

/**
 * Context object + consumer hook live in their own module so that
 * `FinanceContext.jsx` only exports a component (keeps Fast Refresh working
 * and satisfies react-refresh/only-export-components).
 */
export const FinanceContext = createContext(null);

export const useFinance = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance must be used inside a FinanceProvider');
  }

  return context;
};
