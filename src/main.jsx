import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './premium.css'
import App from './App.jsx'
import '@shared/styles/materials.css'
import './showcase.css'
import './optical-theme.css'
import './motion.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

