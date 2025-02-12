
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './AppWrapper';
import './index.css';

// Enable SW registration only in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

// Prevent React double-rendering in development
const StrictModeWrapper = import.meta.env.DEV 
  ? React.StrictMode 
  : React.Fragment;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictModeWrapper>
    <AppWrapper />
  </StrictModeWrapper>
);
