import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const JoinClub = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClub();
  }, [clubId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchClub = async () => {
    try {
      const response = await api.get(`/clubs/${clubId}`);
      setClub(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching club:', error);
      setError('Failed to load club details');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as a volunteer to join clubs');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Get volunteer info from token or API
      const volunteerResponse = await api.get('/volunteers/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const volunteer = volunteerResponse.data;

      await api.post('/clubs/join', {
        clubId,
        volunteerId: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
      });
      
      navigate('/my-clubs');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join club. Please login first.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Join {club?.name}</h1>
          <p className="text-neutral-600 mb-6">{club?.description}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Quick Join</h3>
                <p className="text-blue-700 text-sm">
                  You're logged in as a volunteer. Click "Join Club" below to join using your registered profile information.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Join Club
              </button>
              <button
                type="button"
                onClick={() => navigate('/clubs')}
                className="px-8 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinClub;
