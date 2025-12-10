import React, { useEffect, useState } from 'react'
import './App.css'
import { Button } from '@mui/material'
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { useDispatch } from 'react-redux';
import { useAuth } from 'react-oauth2-code-pkce'
import { setCredentials } from './store/authSlice';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {

  const auth = useAuth();
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (auth.token) {
      dispatch(setCredentials({token: auth.token, user: auth.tokenData}));
      setAuthReady(true);
    }
  }, [auth.token, auth.tokenData, dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <Button 
          variant="contained"
          color="error"
          onClick={() => {
            auth.logIn();
          }}>
          Login
        </Button>
      </Router>
    </ErrorBoundary>
  )
}

export default App
