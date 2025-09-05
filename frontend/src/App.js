import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoaSevaFlow from './GoaSevaFlow';
import Login from './auth/login';
import Signup from './auth/signup';
import ProtectedRoute from './auth/protectedRoute';
import LandingPage from './landingPage';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <GoaSevaFlow />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App;
