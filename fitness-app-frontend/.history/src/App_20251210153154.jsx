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


  
  return (
    <Router>
      <Button variant='contained' color=''>Log In</Button>
    </Router>
  )
}

export default App