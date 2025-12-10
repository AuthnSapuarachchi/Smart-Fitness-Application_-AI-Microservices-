import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import {store} from './store/store'
omp

import App from './App'

// Initialize React app
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html has <div id="root"></div>')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <AuthProvider authConfig={authConfig}>
    <Provider store={store}>
      <App />
    </Provider>
</AuthProvider>
)