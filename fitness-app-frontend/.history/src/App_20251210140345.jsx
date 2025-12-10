import React, { useState } from 'react'
import './App.css'
import { Button, Container, Box } from '@mui/material'

function App() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    // TODO: Add your login logic here
    console.log('Login clicked')
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <h1>Fitness App</h1>
        <Button 
          variant="contained"
          color="error"
          size="large"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Container>
  )
}

export default App
