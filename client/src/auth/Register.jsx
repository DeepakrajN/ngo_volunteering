import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerAPI } from '../api';
import ImageUploader from '../components/ImageUploader';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    bloodGroup: '',
    address: '',
    occupation: '',
    interests: '',
    availability: '',
    hobby: '',
    maritalStatus: '',
    educationalQualification: '',
    nativeLocation: '',
    currentLocation: '',
    password: '',
    photo: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        interests: formData.interests.split(',').map(item => item.trim()),
      };
      const response = await volunteerAPI.register(dataToSend);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Volunteer Registration</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-100 mb-2">
            Profile Photo
          </label>
          <ImageUploader
            onImageSelect={(photo) => setFormData({ ...formData, photo })}
            currentImage={formData.photo}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-dark-100">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your full name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-dark-100">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your age"
          />
        </div>
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
          <label htmlFor="phone" className="block text-sm font-medium text-dark-100">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bloodGroup" className="block text-sm font-medium text-dark-100">
            Blood Group
          </label>
          <input
            type="text"
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="e.g., O+, A-"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-dark-100">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your address"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="occupation" className="block text-sm font-medium text-dark-100">
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your occupation"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="interests" className="block text-sm font-medium text-dark-100">
            Interests (comma-separated)
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="e.g., teaching, environment, health"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="availability" className="block text-sm font-medium text-dark-100">
            Availability
          </label>
          <input
            type="text"
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="e.g., Weekends, Evenings"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hobby" className="block text-sm font-medium text-dark-100">
            Hobby
          </label>
          <input
            type="text"
            id="hobby"
            name="hobby"
            value={formData.hobby}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your hobby"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-dark-100">
            Marital Status
          </label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="educationalQualification" className="block text-sm font-medium text-dark-100">
            Educational Qualification
          </label>
          <input
            type="text"
            id="educationalQualification"
            name="educationalQualification"
            value={formData.educationalQualification}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="e.g., Bachelor's Degree"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nativeLocation" className="block text-sm font-medium text-dark-100">
            Native Location
          </label>
          <input
            type="text"
            id="nativeLocation"
            name="nativeLocation"
            value={formData.nativeLocation}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your native location"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="currentLocation" className="block text-sm font-medium text-dark-100">
            Current Location
          </label>
          <input
            type="text"
            id="currentLocation"
            name="currentLocation"
            value={formData.currentLocation}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 text-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            placeholder="Enter your current location"
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
            placeholder="Create a password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
