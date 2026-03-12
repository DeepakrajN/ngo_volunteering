import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await volunteerAPI.login(formData);
      // Clear any admin token to avoid accidental admin auth when acting as volunteer
      localStorage.removeItem('adminToken');
      // Use auth context to set user data
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Volunteer Login</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-dark-100">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-dark-100">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-800">Register here</a>
      </p>
    </div>
  );
};

export default Login;
