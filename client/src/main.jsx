import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FFFFFF',
              color: '#1E293B',
              border: '0.5px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
            success: {
              style: { background: '#ECFDF5', color: '#065F46', border: '0.5px solid #A7F3D0' },
              iconTheme: { primary: '#059669', secondary: '#ECFDF5' }
            },
            error: {
              style: { background: '#FEF2F2', color: '#991B1B', border: '0.5px solid #FECACA' },
              iconTheme: { primary: '#DC2626', secondary: '#FEF2F2' }
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
