import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import { Button, Container, Box, Typography, CircularProgress } from '@mui/material'
import { Router } from 'react-router';
import { AuthContext } from "react-oauth2-code-pkce";


function App() {
  const {
    token,
    tokenData,
    logIn,
    logOut,
    isAuthenticated,} = useContext(AuthContext);

  useEffect(() => {
    
  })



  
  return (
    <Router>
      <Button variant='contained' color='#dc004e'>Log In</Button>
    </Router>
  )
}

export default App