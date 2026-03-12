import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const MyClubs = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [notJoinedClubs, setNotJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyClubs();
  }, []);

  const fetchMyClubs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Get volunteer info
      const volunteerResponse = await api.get('/volunteers/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const volunteerId = volunteerResponse.data._id;
      
      const response = await api.get(`/clubs/my-clubs?volunteerId=${volunteerId}`);
      setJoinedClubs(response.data.joinedClubs);
      setNotJoinedClubs(response.data.notJoinedClubs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setLoading(false);
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
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">My Clubs</h1>
          <p className="text-lg text-neutral-600">Manage your club memberships</p>
        </motion.div>

        {/* Joined Clubs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Joined Clubs ({joinedClubs.length})</h2>
          {joinedClubs.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-neutral-200">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-neutral-600">You haven't joined any clubs yet</p>
              <Link
                to="/clubs"
                className="inline-block mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Browse Clubs
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedClubs.map((club, i) => (
                <motion.div
                  key={club._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/clubs/${club._id}/dashboard`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-green-200"
                  >
                    <div className="h-32 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                      <span className="text-5xl">✅</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">{club.name}</h3>
                      <p className="text-neutral-600 mb-2 text-sm">{club.category}</p>
                      <p className="text-neutral-700 mb-4 line-clamp-2">{club.description}</p>
                      <div className="flex items-center text-sm text-neutral-600 mb-4">
                        <span className="mr-2">👥</span>
                        <span>{club.members?.length || 0} members</span>
                      </div>
                      <div className="text-primary-600 font-semibold">View Dashboard →</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Available Clubs */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Available Clubs ({notJoinedClubs.length})</h2>
          {notJoinedClubs.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-neutral-200">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-neutral-600">You've joined all available clubs!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notJoinedClubs.map((club, i) => (
                <motion.div
                  key={club._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200"
                >
                  <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <span className="text-5xl">🏢</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{club.name}</h3>
                    <p className="text-neutral-600 mb-2 text-sm">{club.category}</p>
                    <p className="text-neutral-700 mb-4 line-clamp-2">{club.description}</p>
                    <div className="flex items-center text-sm text-neutral-600 mb-4">
                      <span className="mr-2">👥</span>
                      <span>{club.members?.length || 0} members</span>
                    </div>
                    <Link
                      to={`/clubs/join/${club._id}`}
                      className="block bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold text-center transition-all"
                    >
                      Join Club
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClubs;
