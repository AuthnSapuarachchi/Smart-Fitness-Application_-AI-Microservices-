import React from 'react'
import './App.css'
import { Button } from '@mui/material'
import { BrowserRouter as Router, Navigate, Route, Routes,} from "react-router";


function App() {

  const {token } = useContext(AuthContext);

  return (
    
      <Router>
        <Button variant="contained">Login</Button>
      </Router>
    
  )
}

export default App
