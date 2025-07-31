// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ users, setIsLoggedIn }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      alert('Login successful!');
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/chat');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className='auth-container'>
      <div className='login-header'>
        <h1 className='login-title'>GoaSevaFlow</h1>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type='submit'>Login</button>
        <p>
          Don’t have an account?{' '}
          <span
            className='auth-link'
            onClick={() => navigate('/signup')}>
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
