import React, { useState, useEffect } from 'react'
import './App.css'
import { Button, Container, Box, Typography, CircularProgress, Grid } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import PoolIcon from '@mui/icons-material/Pool'
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import ActivityForme from './components/ActivityForme'
import ActivityList from './components/ActivityList'
import ActivityDetail from './components/ActivityDetail'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router'

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

  const ActivityPage = () => {
    return (
      <Grid container spacing={3} sx={{ width: '100%', mt: 2 }}>
        {/* Left Side - Activity Form */}
        <Grid item xs={12} md={6}>
          <Box 
            sx={{ 
              position: 'sticky',
              top: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              padding: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: '#667eea',
                textAlign: 'center'
              }}
            >
              Track Activity
            </Typography>
            <ActivityForme onActivityAdded={() => window.location.reload()} />
          </Box>
        </Grid>

        {/* Right Side - Activity List */}
        <Grid item xs={12} md={6}>
          <ActivityList />
        </Grid>
      </Grid>
    )
  }

  // Fitness Background Component
  const FitnessBackground = () => {
    const fitnessIcons = [
      { Icon: FitnessCenterIcon, top: '10%', left: '10%', size: 60, delay: 0 },
      { Icon: DirectionsRunIcon, top: '20%', right: '15%', size: 50, delay: 0.5 },
      { Icon: DirectionsBikeIcon, top: '70%', left: '8%', size: 55, delay: 1 },
      { Icon: PoolIcon, top: '60%', right: '10%', size: 45, delay: 1.5 },
      { Icon: SportsGymnasticsIcon, top: '40%', left: '5%', size: 50, delay: 2 },
      { Icon: FavoriteBorderIcon, top: '15%', left: '85%', size: 40, delay: 2.5 },
      { Icon: LocalFireDepartmentIcon, top: '80%', left: '75%', size: 48, delay: 3 },
      { Icon: SelfImprovementIcon, top: '35%', right: '5%', size: 42, delay: 3.5 },
      { Icon: DirectionsRunIcon, top: '85%', left: '20%', size: 38, delay: 4 },
      { Icon: DirectionsBikeIcon, top: '50%', right: '20%', size: 52, delay: 4.5 },
    ]

    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }
        }}
      >
        {fitnessIcons.map((item, index) => {
          const { Icon, top, left, right, size, delay } = item
          return (
            <Box
              key={index}
              className="fitness-icon"
              sx={{
                position: 'absolute',
                top,
                left,
                right,
                animation: `float 6s ease-in-out ${delay}s infinite`,
                opacity: 0.15,
              }}
            >
              <Icon sx={{ fontSize: size, color: 'white' }} />
            </Box>
          )
        })}
      </Box>
    )
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
    <BrowserRouter>
      <FitnessBackground />
      <Container maxWidth="xl">
        <Box sx={{ minHeight: '100vh', py: 3 }}>
          {isLoggedIn ? (
            <Box sx={{ width: '100%' }}>
              <Routes>
                <Route path="/" element={<ActivityPage />} />
                <Route path="/activities/:id" element={<ActivityDetail />} />
              </Routes>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="large" 
                  onClick={handleLogout}
                  sx={{ 
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: 4,
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: 4,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <FitnessCenterIcon sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Fitness App
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 2
                    }}
                  >
                    Track your workouts, Get AI-powered recommendations
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleLogin}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                    padding: '12px 48px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  Login with OAuth2
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </BrowserRouter>
  )
}

export default App
