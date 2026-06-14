import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { I18nProvider } from './i18n'
import { ErrorBoundary } from './components/ErrorBoundary'

// Strip the trailing slash so React Router's basename works under a sub-path
// (e.g. '/AI-StayEasy/' -> '/AI-StayEasy'). Empty string at root.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
