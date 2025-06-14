import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import RedirectHandler from './components/RedirectHandler';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const path = window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      {path === '/redirect' ? <RedirectHandler /> : <App />}
    </AuthProvider>
  </StrictMode>
);
