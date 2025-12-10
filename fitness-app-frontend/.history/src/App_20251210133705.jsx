import React, { useEffect } from 'react'
import './App.css'
import { Button } from '@mui/material'
import { BrowserRouter as Router, Navigate, Route, Routes,} from "react-router";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { setCredentials } from './store/authSlice';

function App() {

  const {token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady]  = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    
      <Router>
        <Button variant="contained"
        >Login</Button>
      </Router>
    
  )
}

export default App
