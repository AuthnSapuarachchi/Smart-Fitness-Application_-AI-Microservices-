import React, { useState, useEffect } from 'react'
import './App.css'
import { Button, Container, Box, Typography } from '@mui/material'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if there's a token in URL (OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const code = params.get('code')
    
    if (token) {
      localStorage.setItem('auth_token', token)
      setIsLoggedIn(true)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    // Check if already logged in
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setIsLoggedIn(true)
      setUserData({ name: 'User' })
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Redirect to OAuth provider
      const authUrl = new URL('http://localhost:8181/realms/fitness-oAuth2/protocol/openid-connect/auth')
      authUrl.searchParams.set('client_id', 'oauth2-pkce-client')
      authUrl.searchParams.set('redirect_uri', window.location.origin)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', 'openid profile email')
      
      window.location.href = authUrl.toString()
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setIsLoggedIn(false)
    setUserData(null)
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 2
      }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
          Fitness App
        </Typography>

        {isLoggedIn ? (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Welcome, {userData?.name || 'User'}!
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'success.main' }}>
              ✓ You are successfully logged in
            </Typography>
            <Button 
              variant="contained"
              color="error"
              size="large"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button 
            variant="contained"
            color="error"
            size="large"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Redirecting to login...' : 'Login'}
          </Button>
        )}
      </Box>
    </Container>
  )
}

export default App
