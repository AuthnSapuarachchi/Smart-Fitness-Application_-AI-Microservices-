import React, { useState, useEffect } from 'react'
import './App.css'
import { Button, Container, Box, Typography, CircularProgress, Grid, AppBar, Toolbar, Avatar, Chip, Card } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import PoolIcon from '@mui/icons-material/Pool'
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
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

  // Header Component with Navigation
  const Header = () => {
    return (
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FitnessCenterIcon 
              sx={{ 
                fontSize: 36, 
                color: '#667eea',
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              AuthGain Fitness Tracker
            </Typography>
          </Box>

          {/* User Info and Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#667eea',
                  width: 36,
                  height: 36
                }}
              >
                <PersonIcon />
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#667eea',
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}
                >
                  {user?.preferred_username || user?.name || 'User'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1
                  }}
                >
                  {user?.email || ''}
                </Typography>
              </Box>
            </Box>
            
            <Button 
              variant="outlined"
              size="small"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                borderColor: '#667eea',
                color: '#667eea',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                '&:hover': {
                  borderColor: '#764ba2',
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    )
  }

  // Welcome Section Component
  const WelcomeSection = () => {
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
    
    return (
      <Box 
        sx={{ 
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1
          }}
        >
          {greeting}, {user?.preferred_username || user?.name || 'User'}! 👋
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '1rem'
          }}
        >
          Ready to track your fitness journey? Log your activities and get AI-powered insights.
        </Typography>
      </Box>
    )
  }

  const ActivityPage = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <WelcomeSection />
        <Grid container spacing={3} sx={{ width: '100%' }}>
        {/* Left Side - Activity Form */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              padding: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <FitnessCenterIcon sx={{ fontSize: 28, color: '#667eea' }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#667eea',
                }}
              >
                Log New Activity
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                mb: 3,
                fontSize: '0.95rem'
              }}
            >
              Fill in the details below to track your workout and receive personalized AI recommendations.
            </Typography>
            <ActivityForme onActivityAdded={() => window.location.reload()} />
          </Card>
        </Grid>

        {/* Right Side - Activity List */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 2,
                px: 1
              }}
            >
              <DirectionsRunIcon sx={{ fontSize: 28, color: '#667eea' }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#667eea',
                }}
              >
                Your Activities
              </Typography>
            </Box>
            <ActivityList />
          </Box>
        </Grid>
      </Grid>
      </Box>
    )
  }

  // Fitness Background Component
  

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
      <Box sx={{ minHeight: '100vh' }}>
        {isLoggedIn ? (
          <Box>
            <Header />
            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
              <Routes>
                <Route path="/" element={<ActivityPage />} />
                <Route path="/activities/:id" element={<ActivityDetail />} />
              </Routes>
            </Container>
          </Box>
        ) : (
          <Container maxWidth="sm">
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
                    AuthGain Fitness App
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
          </Container>
        )}
      </Box>
    </BrowserRouter>
  )
}

export default App
