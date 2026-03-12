import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const ClubDashboard = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClub();
  }, [clubId]);

  const fetchClub = async () => {
    try {
      const response = await api.get(`/clubs/${clubId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white mb-8">
            <h1 className="text-4xl font-bold mb-2">{club?.name}</h1>
            <p className="text-primary-100 text-lg">{club?.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="bg-white/20 px-4 py-2 rounded-lg">📂 {club?.category}</span>
              <span className="bg-white/20 px-4 py-2 rounded-lg">👥 {club?.members?.length || 0} Members</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Meetings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
              <span className="mr-2">📅</span> Upcoming Meetings
            </h2>
            {club?.meetings && club.meetings.length > 0 ? (
              <div className="space-y-4">
                {club.meetings.map((meeting, i) => (
                  <div key={i} className="border-l-4 border-primary-600 bg-primary-50 p-4 rounded">
                    <h3 className="font-semibold text-neutral-900">{meeting.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      📍 {meeting.location} | 🕐 {new Date(meeting.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-neutral-700 mt-2">{meeting.agenda}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <div className="text-4xl mb-2">📅</div>
                <p>No upcoming meetings scheduled</p>
              </div>
            )}
          </motion.div>

          {/* Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
              <span className="mr-2">🎯</span> Recent Activities
            </h2>
            {club?.activities && club.activities.length > 0 ? (
              <div className="space-y-4">
                {club.activities.map((activity, i) => (
                  <div key={i} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{activity.title}</h3>
                        <p className="text-sm text-neutral-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-neutral-500 mt-2">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        activity.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <div className="text-4xl mb-2">🎯</div>
                <p>No activities yet</p>
              </div>
            )}
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
              <span className="mr-2">📋</span> Requirements & Needs
            </h2>
            {club?.requirements && club.requirements.length > 0 ? (
              <div className="space-y-3">
                {club.requirements.map((req, i) => (
                  <div key={i} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{req.title}</h3>
                        <p className="text-sm text-neutral-600 mt-1">{req.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        req.priority === 'High' ? 'bg-red-100 text-red-700' :
                        req.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {req.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <div className="text-4xl mb-2">📋</div>
                <p>No requirements listed</p>
              </div>
            )}
          </motion.div>

          {/* Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
              <span className="mr-2">👥</span> Members ({club?.members?.length || 0})
            </h2>
            {club?.members && club.members.length > 0 ? (
              <div className="space-y-3">
                {club.members.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{member.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{member.name}</p>
                      <p className="text-xs text-neutral-500">{member.email}</p>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <div className="text-4xl mb-2">👥</div>
                <p>No members yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
