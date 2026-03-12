import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get('/clubs');
      setClubs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setLoading(false);
    }
  };

  const handleJoinClick = (clubId) => {
    navigate(`/clubs/join/${clubId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Clubs & Chapters</h1>
          <p className="text-lg text-neutral-600">Join a club and connect with like-minded volunteers</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, i) => (
            <motion.div
              key={club._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200"
            >
              {club.image ? (
                <img src={club.image} alt={club.name} className="h-32 w-full object-cover" />
              ) : (
                <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-5xl">🏢</span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{club.name}</h3>
                <p className="text-neutral-600 mb-2 text-sm">{club.category}</p>
                <p className="text-neutral-700 mb-4 line-clamp-3">{club.description}</p>
                <div className="flex items-center text-sm text-neutral-600 mb-4">
                  <span className="mr-2">👥</span>
                  <span>{club.members?.length || 0} members</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/clubs/${club._id}`}
                    className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2 px-4 rounded-lg font-semibold text-center transition-all"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleJoinClick(club._id)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-all"
                  >
                    Join Club
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
