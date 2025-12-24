import React from 'react'
import { AppBar, Toolbar, Box, Typography, Avatar, Button } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'

const Header = ({ user, handleLogout }) => {
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
            AFitness Tracker
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

export default Header