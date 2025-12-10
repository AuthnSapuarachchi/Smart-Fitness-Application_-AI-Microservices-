import React, { useState } from 'react'
import './App.css'
import { Button, Container, Box, Typography } from '@mui/material'
import { AuthProvider, useAuth } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig'

// Login component that uses the auth hook
function LoginComponent() {
  const { logIn, isLoading, tokenData } = useAuth()

  if (tokenData) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Welcome, {tokenData.name || tokenData.email || 'User'}!
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          You are successfully logged in.
        </Typography>
      </Box>
    )
  }

  return (
    <Button 
      variant="contained"
      color="error"
      size="large"
      onClick={() => logIn()}
      disabled={isLoading}
    >
      {isLoading ? 'Logging in...' : 'Login'}
    </Button>
  )
}

// Main App component wrapped with AuthProvider
function App() {
  return (
    <AuthProvider authConfig={authConfig}
                  loadingComponent={<Typography>Loading...</Typography>}>
      <Container maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <h1>Fitness App</h1>
          <LoginComponent />
        </Box>
      </Container>
    </AuthProvider>
  )
}

export default App
