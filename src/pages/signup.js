// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({ users, setUsers }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    const exists = users.find((u) => u.email === form.email);
    if (exists) {
      alert('User already exists!');
      return;
    }

    if (form.password.length < 6) {
      alert('Password should be at least 6 characters');
      return;
    }

    setUsers([...users, form]);
    alert('Signup successful! Please login.');
    navigate('/login');
  };

  return (
    <div className='auth-container'>
      <div className='login-header'>
        <h1 className='login-title'>GoaSevaFlow</h1>
      </div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <button type='submit'>Sign Up</button>
        <p>
          Already have an account?{' '}
          <span
            className='auth-link'
            onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
