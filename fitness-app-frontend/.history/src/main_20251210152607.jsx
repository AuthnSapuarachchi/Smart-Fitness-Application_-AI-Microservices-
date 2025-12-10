import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from 'react-oauth2-code-pkce'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider></AuthProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
)