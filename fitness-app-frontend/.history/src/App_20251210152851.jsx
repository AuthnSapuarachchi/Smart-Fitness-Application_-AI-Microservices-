import React, { useState, useEffect } from 'react'
import './App.css'
import { Button, Container, Box, Typography, CircularProgress } from '@mui/material'


function App() {
  const {
    token,
    tokenData,
    logIn,
    }
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('JWT decode error:', error)
      return {}
    }
  }

  const exchangeCodeForToken = async (code) => {
    try {
      console.log('Exchanging code for token...')
      const response = await fetch('http://localhost:8181/realms/fitness-oAuth2/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: 'oauth2-pkce-client',
          redirect_uri: window.location.origin,
          code: code,
        }),
      })

      const data = await response.json()
      console.log('Token response:', response.status, data)

      if (response.ok && data.access_token) {
        const token = data.access_token
        localStorage.setItem('auth_token', token)
        const decodedToken = decodeJWT(token)
        const userInfo = {
          name: decodedToken.name || decodedToken.preferred_username || 'User',
          email: decodedToken.email || '',
          preferred_username: decodedToken.preferred_username || '',
          token_data: decodedToken
        }
        console.log('User info extracted:', userInfo)
        setUserData(userInfo)
        localStorage.setItem('user_data', JSON.stringify(userInfo))
        setIsLoggedIn(true)
        setIsLoading(false)
      } else {
        const errorMsg = data.error_description || data.error || 'Unknown error'
        console.error('Token exchange failed:', errorMsg)
        alert('Login failed: ' + errorMsg)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Token exchange error:', error)
      alert('Login error: ' + error.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      setIsLoading(true)
      // Clear the code from URL immediately to prevent reuse
      window.history.replaceState({}, document.title, window.location.pathname)
      exchangeCodeForToken(code)
    } else {
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) {
        setIsLoggedIn(true)
        const savedUserData = localStorage.getItem('user_data')
        if (savedUserData) {
          setUserData(JSON.parse(savedUserData))
        }
      }
    }
  }, [])

  const handleLogin = () => {
    setIsLoading(true)
    const authUrl = new URL('http://localhost:8181/realms/fitness-oAuth2/protocol/openid-connect/auth')
    authUrl.searchParams.set('client_id', 'oauth2-pkce-client')
    authUrl.searchParams.set('redirect_uri', window.location.origin)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'openid profile email')
    window.location.href = authUrl.toString()
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setIsLoggedIn(false)
    setUserData(null)
  }

  if (isLoading && !isLoggedIn) {
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
            <Typography variant="h5" sx={{ mb: 2 }}>Welcome, {userData?.name || 'User'}!</Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'success.main' }}>✓ Successfully logged in</Typography>
            <Box sx={{ width: '100%', bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3, maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>User Data:</Typography>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(userData, null, 2)}</pre>
            </Box>
            <Button variant="contained" color="error" size="large" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button variant="contained" color="error" size="large" onClick={handleLogin} disabled={isLoading}>{isLoading ? 'Redirecting...' : 'Login'}</Button>
        )}
      </Box>
    </Container>
  )
}

export default App