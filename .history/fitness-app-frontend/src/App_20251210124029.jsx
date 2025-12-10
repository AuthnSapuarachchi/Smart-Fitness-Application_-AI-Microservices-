import './App.css'
import { Button } from '@mui/material'
import { BrowserRouter as Router, Navigate, Route, Routes, uLocation } from "react-router";


function App() {
  return (
    <Router>
      <Button varient="contained" color="#dc3545">Login</Button>
    </Router>
  )
}

export default App
