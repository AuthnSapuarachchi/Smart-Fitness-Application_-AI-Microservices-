import React, { useState, useEffect } from 'react'
import './App.css'
import { Button, Container, Box, Typography, CircularProgress } from '@mui/material'

const KEYCLOAK_URL = 'http://localhost:8181/realms/fitness-oAuth2'
const CLIENT_ID = 'oauth2-pkce-client'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [codeProcessed, setCodeProcessed] = useState(false)

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch {
      return {}
    }
  }

  const exchangeCode = async (code) => {
    try {
      const response = await fetch(`${KEYCLOAK_URL}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          redirect_uri: window.location.origin,
          code,
        }),
      })

      const data = await response.json()
      console.log('Token response:', response.status, data)
      
      if (data.access_token) {
        const decoded = decodeToken(data.access_token)
        setUser(decoded)
        setIsLoggedIn(true)
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(decoded))
        localStorage.setItem('userid', decoded.sub || decoded.id || '')
        window.history.replaceState({}, '', window.location.pathname)
      } else if (data.error === 'invalid_grant') {
        console.error('Code already used or invalid')
      } else {
        alert('Login failed: ' + (data.error_description || data.error || 'Unknown error'))
      }
      setCodeProcessed(true)
    } catch (error) {
      alert('Login error: ' + error.message)
      setCodeProcessed(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code && !codeProcessed) {
      setLoading(true)
      exchangeCode(code)
    } else if (!code && !codeProcessed) {
      const token = localStorage.getItem('token')
      const isLoggingOut = sessionStorage.getItem('loggingOut')
      if (token && !isLoggingOut) {
        setIsLoggedIn(true)
        setUser(JSON.parse(localStorage.getItem('user') || '{}'))
      }
      sessionStorage.removeItem('loggingOut')
      setCodeProcessed(true)
    }
  }, [codeProcessed])

  const handleLogin = () => {
    const authUrl = new URL(`${KEYCLOAK_URL}/protocol/openid-connect/auth`)
    authUrl.searchParams.set('client_id', CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', window.location.origin)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'openid profile email')
    authUrl.searchParams.set('prompt', 'login')
    window.location.href = authUrl.toString()
  }

  const handleLogout = () => {
    sessionStorage.setItem('loggingOut', 'true')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userid')
    setIsLoggedIn(false)
    setUser(null)
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
          <CircularProgress />
          <Typography>Processing login...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3 }}>Fitness App</Typography>
        {isLoggedIn ? (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>Welcome, {user?.name}!</Typography>
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
            
            </Box>
            <Button variant="contained" color="error" size="large" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button variant="contained" color="error" size="large" onClick={handleLogin}>Login</Button>
        )}
      </Box>
    </Container>
  )
}

export default App