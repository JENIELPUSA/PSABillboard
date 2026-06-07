import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AnnouncementProvider } from './contexts/AnnouncementContext.jsx'
import { QmsCornerProvider } from './contexts/QmsContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QmsCornerProvider>
        <AnnouncementProvider>
          <App />
        </AnnouncementProvider>
      </QmsCornerProvider>
    </AuthProvider>


  </StrictMode>,
)



