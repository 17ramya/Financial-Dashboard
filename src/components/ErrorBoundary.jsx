import React from 'react';

/**
 * Catches render-time errors anywhere in the tree and shows a friendly fallback
 * instead of a blank white screen. Wired up in `main.jsx` so production builds
 * degrade gracefully rather than failing silently.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Surface the details in the browser console for debugging in production.
    console.error('Unhandled UI error:', error, info && info.componentStack);
  }

  handleReload() {
    window.location.reload();
  }

  handleReset() {
    // Clear the persisted sandbox data and reload with a clean slate.
    try {
      ['fin_transactions', 'fin_role', 'fin_theme'].forEach(key => localStorage.removeItem(key));
    } catch {
      // localStorage can be unavailable (private browsing) - reload anyway.
    }
    window.location.reload();
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-color)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            padding: '2rem',
            maxWidth: '480px',
            width: '100%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            The dashboard hit an unexpected error. Reloading usually fixes it.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => this.handleReload()}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-color)',
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              Reload dashboard
            </button>
            <button
              type="button"
              onClick={() => this.handleReset()}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-main)',
                fontWeight: 600,
              }}
            >
              Reset saved data
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
