import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1c1719',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '13.5px',
            padding: '10px 14px',
            boxShadow: '0 16px 32px -12px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#1c1719' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#1c1719' },
          },
        }}
      />
      <App />
    </ThemeProvider>
  </StrictMode>,
)