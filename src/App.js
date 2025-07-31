// src/App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import GoaSevaFlow from './GoaSevaFlow'; // your chatbot page

function App() {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  return (
    <Router>
      <Routes>
        {/* 👇 Default route goes to login */}
        <Route
          path='/'
          element={<Navigate to='/login' />}
        />

        <Route
          path='/login'
          element={
            <Login
              users={users}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path='/signup'
          element={
            <Signup
              users={users}
              setUsers={setUsers}
            />
          }
        />
        <Route
          path='/chat'
          element={isLoggedIn ? <GoaSevaFlow /> : <Navigate to='/login' />}
        />

        {/* Catch-all: redirect to login if no match */}
        <Route
          path='*'
          element={<Navigate to='/login' />}
        />
      </Routes>
    </Router>
  );
}

export default App;
