import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import QuickStats from '../components/QuickStats';

const Dashboard = () => {
  const quickLinks = [
    { to: '/volunteers', label: 'View Volunteers', icon: '👥', color: 'bg-blue-600' },
    { to: '/events', label: 'Browse Events', icon: '📅', color: 'bg-green-600' },
    { to: '/announcements', label: 'Read Announcements', icon: '📢', color: 'bg-purple-600' },
    { to: '/clubs', label: 'Explore Clubs', icon: '🏢', color: 'bg-orange-600' },
    { to: '/gallery', label: 'Photo Gallery', icon: '📸', color: 'bg-pink-600' },
    { to: '/donate', label: 'Make Donation', icon: '💝', color: 'bg-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Dashboard</h1>
          <p className="text-lg text-neutral-600">Overview of volunteer activities and community engagement</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <QuickStats />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={link.to}
                  className={`${link.color} hover:opacity-90 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg`}
                >
                  <span className="text-4xl">{link.icon}</span>
                  <span className="font-semibold text-center">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">New volunteer joined</p>
                  <p className="text-sm text-neutral-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">📅</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Event registration opened</p>
                  <p className="text-sm text-neutral-600">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">📢</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">New announcement posted</p>
                  <p className="text-sm text-neutral-600">1 day ago</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-primary-600 bg-primary-50 rounded">
                <p className="font-semibold text-neutral-900">Community Cleanup Drive</p>
                <p className="text-sm text-neutral-600">Tomorrow, 9:00 AM</p>
              </div>
              <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded">
                <p className="font-semibold text-neutral-900">Food Distribution</p>
                <p className="text-sm text-neutral-600">This Weekend</p>
              </div>
              <div className="p-4 border-l-4 border-orange-600 bg-orange-50 rounded">
                <p className="font-semibold text-neutral-900">Youth Mentorship Program</p>
                <p className="text-sm text-neutral-600">Next Week</p>
              </div>
            </div>
            <Link
              to="/events"
              className="mt-6 block text-center bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              View All Events
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
