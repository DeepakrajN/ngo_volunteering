import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QuickStats = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    events: 0,
    announcements: 0,
    clubs: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [volunteersRes, eventsRes, announcementsRes] = await Promise.all([
          fetch('/api/volunteers').then(r => r.json()),
          fetch('/api/events').then(r => r.json()),
          fetch('/api/announcements').then(r => r.json())
        ]);

        setStats({
          volunteers: volunteersRes.length || 0,
          events: eventsRes.length || 0,
          announcements: announcementsRes.length || 0,
          clubs: 8
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Volunteers', value: stats.volunteers, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Active Events', value: stats.events, icon: '📅', color: 'from-green-500 to-green-600' },
    { label: 'Announcements', value: stats.announcements, icon: '📢', color: 'from-purple-500 to-purple-600' },
    { label: 'Active Clubs', value: stats.clubs, icon: '🏢', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{stat.icon}</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
              className="text-3xl font-bold"
            >
              {stat.value}
            </motion.div>
          </div>
          <div className="text-sm font-medium opacity-90">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
