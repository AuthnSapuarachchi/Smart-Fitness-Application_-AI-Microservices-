import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import { Button, Container, Box, Typography, CircularProgress } from '@mui/material'


function App() {
  const {
    token,
    tokenData,
    logIn,
    logOut,
    isAuthenticated,} = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  
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