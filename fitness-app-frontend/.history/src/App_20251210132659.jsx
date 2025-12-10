import React from 'react'
import './App.css'
import { Button } from '@mui/material'
import { BrowserRouter as Router, Navigate, Route, Routes,} from "react-router";

// Error Boundary Component
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ padding: '20px', textAlign: 'center' }}>
//           <h1>Something went wrong</h1>
//           <p>{this.state.error?.message}</p>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

function App() {

  const {token } = useSelector((state) => state.auth);

  return (
    
      <Router>
        <Button variant="contained">Login</Button>
      </Router>
    
  )
}

export default App
