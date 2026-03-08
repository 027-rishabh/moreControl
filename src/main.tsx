/// <reference types="vite/client" />

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Only initialize MSW in development mode
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  import('./services/api').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
    })
  }).catch(() => {
    // Silently fail if MSW is not available
  })
}

// Mount React app
const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
