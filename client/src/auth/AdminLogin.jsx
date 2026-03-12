import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const response = await adminAPI.login(formData);
  // Clear any volunteer token to avoid accidental use when performing admin actions
  localStorage.removeItem('token');
  localStorage.setItem('adminToken', response.data.token);
      navigate('/admin-dashboard');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="bg-dark-800 shadow-lg rounded-lg p-8 w-full max-w-md border border-dark-700">
        <h1 className="text-3xl font-bold mb-8 text-center text-dark-100">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-dark-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md shadow-sm text-dark-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
              placeholder="Enter admin username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-dark-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md shadow-sm text-dark-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
