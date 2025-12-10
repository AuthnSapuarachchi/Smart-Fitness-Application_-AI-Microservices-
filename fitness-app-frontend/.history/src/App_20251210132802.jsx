import React from 'react'
import './App.css'
import { Button } from '@mui/material'
import { BrowserRouter as Router, Navigate, Route, Routes,} from "react-router";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {

  const {token, tokenData, logIn, logOut } = useContext(AuthContext);

  return (
    
      <Router>
        <Button variant="contained">Login</Button>
      </Router>
    
  )
}

export default App
