import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { announcementAPI } from '../api';
import ShareButton from '../components/ShareButton';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementAPI.getAnnouncements();
        setAnnouncements(response.data);
        setFilteredAnnouncements(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    } else {
      setFilteredAnnouncements(announcements);
    }
  }, [searchQuery, announcements]);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60 };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Announcements</h1>
          <p className="text-lg text-neutral-600">Stay updated with the latest news and important information</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </motion.div>

        {filteredAnnouncements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">No announcements found</h3>
            <p className="text-neutral-600">Check back later for updates</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-200 cursor-pointer"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📢</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-neutral-900">{announcement.title}</h2>
                          <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                            <span>{getTimeAgo(announcement.createdAt)}</span>
                            <span>•</span>
                            <span>{new Date(announcement.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      New
                    </span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed line-clamp-2">{announcement.content}</p>
                  <div className="mt-3 flex items-center text-primary-600 font-medium">
                    <span>Read more</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📢</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedAnnouncement.title}</h2>
                    <div className="flex items-center gap-3 text-white/90 mt-1">
                      <span>{getTimeAgo(selectedAnnouncement.createdAt)}</span>
                      <span>•</span>
                      <span>{new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-neutral-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
                <div className="mt-8 flex justify-between items-center">
                  <ShareButton
                    title={selectedAnnouncement.title}
                    text={selectedAnnouncement.content.slice(0, 100)}
                  />
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
