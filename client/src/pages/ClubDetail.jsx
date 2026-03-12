import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClub();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchClub = async () => {
    try {
      const response = await api.get(`/clubs/${id}`);
      setClub(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching club:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12 flex items-center justify-center">
        <div className="text-6xl">⏳</div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Club not found</h2>
          <Link to="/clubs" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Link to="/clubs" className="text-primary-600 hover:text-primary-700 mb-6 inline-block font-medium">
          ← Back to clubs
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
            <p className="text-primary-100 text-lg">{club.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="bg-white/20 px-4 py-2 rounded-lg">📂 {club.category}</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">👥 {club.members?.length || 0} Members</span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-sm text-neutral-600 mb-2">Total Members</div>
                <div className="text-3xl font-bold text-primary-600">{club.members?.length || 0}</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-sm text-neutral-600 mb-2">Activities</div>
                <div className="text-3xl font-bold text-green-600">{club.activities?.length || 0}</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-sm text-neutral-600 mb-2">Meetings</div>
                <div className="text-3xl font-bold text-purple-600">{club.meetings?.length || 0}</div>
              </div>
            </div>

            {club.meetings && club.meetings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Upcoming Meetings</h2>
                <div className="space-y-3">
                  {club.meetings.map((meeting, i) => (
                    <div key={i} className="border-l-4 border-primary-600 bg-primary-50 p-4 rounded">
                      <h3 className="font-semibold text-neutral-900">{meeting.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        📍 {meeting.location} | 🕐 {new Date(meeting.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/clubs/join/${club._id}`)}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Join This Club
              </button>
              <Link
                to="/clubs"
                className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-all"
              >
                Browse More Clubs
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
