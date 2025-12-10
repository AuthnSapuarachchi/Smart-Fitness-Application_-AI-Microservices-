import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider authConfig={authConfig}
    loc>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthProvider>
)