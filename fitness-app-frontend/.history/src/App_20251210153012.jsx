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
    <Rou
  )
}

export default App