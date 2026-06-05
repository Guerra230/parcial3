import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import { initializeAuth } from './app/store/slices/authSlice';
import AppRouter from './routes/AppRouter';
import './index.css';

// Initialize auth state from existing session on app load
store.dispatch(initializeAuth());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a1838',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
            },
            success: {
              iconTheme: { primary: '#5eead4', secondary: '#0a1838' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
