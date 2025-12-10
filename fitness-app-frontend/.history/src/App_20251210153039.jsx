import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import { Button, Container, Box, Typography, CircularProgress } from '@mui/material'
import { Route } from 'react-router';


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
    <Router>
      <
    </Router>
  )
}

export default App