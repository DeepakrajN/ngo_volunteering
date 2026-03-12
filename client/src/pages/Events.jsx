import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api, { eventAPI } from '../api';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import ShareButton from '../components/ShareButton';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVolunteerId, setCurrentVolunteerId] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await eventAPI.getEvents();
        setEvents(eventsRes.data);
        setFilteredEvents(eventsRes.data);
        setLoading(false);
        
        const token = localStorage.getItem('token');
        if (token) {
          const volRes = await api.get('/volunteers/me', { headers: { Authorization: `Bearer ${token}` } });
          const volId = volRes.data.volunteerId || volRes.data._id;
          console.log('Volunteer ID:', volId);
          setCurrentVolunteerId(volId);
          
          const certRes = await api.get(`/certificates/volunteer/${volId}/all`, { headers: { Authorization: `Bearer ${token}` } });
          console.log('Certificates fetched:', certRes.data);
          setCertificates(certRes.data);
        }
      } catch (error) {
        console.error('Error:', error);
        addToast('Failed to load events', 'error');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = events;
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      const now = new Date();
      if (filterType === 'upcoming') {
        filtered = filtered.filter(event => new Date(event.date) >= now);
      } else if (filterType === 'past') {
        filtered = filtered.filter(event => new Date(event.date) < now);
      } else if (filterType === 'registered') {
        filtered = filtered.filter(event => 
          event.registeredVolunteers?.some(v => v.volunteerId === currentVolunteerId)
        );
      }
    }
    setFilteredEvents(filtered);
  }, [searchQuery, filterType, events, currentVolunteerId]);

  const handleRegister = async (event) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast('Please login as a volunteer to register', 'error');
        return;
      }

      const volunteerResponse = await api.get('/volunteers/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const volunteer = volunteerResponse.data;
      console.log('Volunteer data:', volunteer);

      const registrationData = {
        eventId: event._id,
        volunteerId: volunteer.volunteerId || volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
      };
      console.log('Registration data:', registrationData);

      await api.post('/events/register', registrationData);

      addToast(`Successfully registered for ${event.title}!`, 'success');
      setSelectedEvent(null);
      
      // Refresh events to show updated count
      const response = await eventAPI.getEvents();
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error registering:', error);
      addToast(error.response?.data?.message || 'Failed to register', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-12">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-3">Upcoming Events</h1>
            <p className="text-lg text-neutral-600">Join us in making a difference through community events</p>
          </div>
          <button
            onClick={async () => {
              setRefreshing(true);
              try {
                const token = localStorage.getItem('token');
                if (token && currentVolunteerId) {
                  const certRes = await api.get(`/certificates/volunteer/${currentVolunteerId}/all`, { headers: { Authorization: `Bearer ${token}` } });
                  console.log('Refreshed certificates:', certRes.data);
                  setCertificates(certRes.data);
                  addToast('Certificate data refreshed!', 'success');
                }
              } catch (error) {
                console.error('Refresh error:', error);
                addToast('Failed to refresh', 'error');
              } finally {
                setRefreshing(false);
              }
            }}
            disabled={refreshing}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {refreshing ? '⏳ Refreshing...' : '🔄 Refresh Certificates'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              {['all', 'upcoming', 'registered', 'past'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    filterType === type
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">No events found</h3>
            <p className="text-neutral-600">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const isPast = new Date(event.date) < new Date();
              const isRegistered = event.registeredVolunteers?.some(v => v.volunteerId === currentVolunteerId);
              const hasAttended = event.attendance?.some(a => a.volunteerId === currentVolunteerId && a.status === 'present');
              const cert = certificates.find(c => c.eventId === event._id || c.eventId?._id === event._id);
              const certProgress = !cert ? 0 : cert.status === 'pending' ? 50 : cert.status === 'verified' ? 100 : 0;
              console.log(`Event ${event.title}: cert=`, cert, 'progress=', certProgress);
              return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: isPast ? 0 : -5 }}
                className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200 cursor-pointer ${
                  isPast ? 'opacity-50 grayscale cursor-not-allowed' : ''
                }`}
                onClick={() => !isPast && setSelectedEvent(event)}
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <span className="text-6xl">📅</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">{event.title}</h2>
                  <p className="text-neutral-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-neutral-700">
                      <span className="mr-2">📅</span>
                      <span>{new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <span className="mr-2">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <span className="mr-2">👥</span>
                      <span>{event.registeredVolunteers?.length || 0} registered</span>
                    </div>
                  </div>

                  {hasAttended && cert && (
                    <div className="mb-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-neutral-700">🏆 Certificate</span>
                        <span className="text-xs font-bold text-primary-600">{certProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-2">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            certProgress === 100 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                          }`}
                          style={{ width: `${certProgress}%` }}
                        ></div>
                      </div>
                      <div className={`text-xs font-medium ${
                        cert.status === 'verified' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {cert.status === 'pending' && '⏳ Awaiting admin verification'}
                        {cert.status === 'verified' && '✓ Verified - Ready to download'}
                      </div>
                    </div>
                  )}

                  {isPast ? (
                    <div className="w-full bg-neutral-400 text-white py-3 rounded-lg font-semibold text-center">
                      Event Ended
                    </div>
                  ) : isRegistered ? (
                    <div className="flex gap-2">
                      {hasAttended && cert?.status === 'verified' ? (
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            window.open(`/certificates/${cert.certificateId}`, '_blank');
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all shadow-md"
                        >
                          📥 Download Certificate
                        </button>
                      ) : hasAttended ? (
                        <button
                          disabled
                          className="flex-1 bg-amber-100 text-amber-700 py-3 rounded-lg font-semibold cursor-not-allowed"
                        >
                          ⏳ Certificate Pending
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id}/check-in`); }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
                        >
                          📍 Check-In
                        </button>
                      )}
                      <div className="flex-1 bg-green-100 text-green-800 py-3 rounded-lg font-semibold text-center">
                        ✓ Registered
                      </div>
                    </div>
                  ) : (
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all">
                      View Details
                    </button>
                  )}
                </div>
              </motion.div>
            )})}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="h-64 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-8xl">📅</span>
                </div>
              )}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">{selectedEvent.title}</h2>
                <p className="text-neutral-700 mb-6 leading-relaxed">{selectedEvent.description}</p>
                
                <div className="space-y-4 mb-8 bg-neutral-50 p-6 rounded-lg">
                  <div className="flex items-center text-neutral-800">
                    <span className="mr-3 text-2xl">📅</span>
                    <div>
                      <div className="font-semibold">Date & Time</div>
                      <div className="text-neutral-600">{new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-neutral-800">
                    <span className="mr-3 text-2xl">📍</span>
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-neutral-600">{selectedEvent.location}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    {selectedEvent.registeredVolunteers?.some(v => v.volunteerId === currentVolunteerId) ? (
                      <div className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold text-center">
                        ✓ Already Registered
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(selectedEvent)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold transition-all"
                      >
                        Register for Event
                      </button>
                    )}
                    <ShareButton
                      title={selectedEvent.title}
                      text={`Check out this event: ${selectedEvent.title}`}
                    />
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-4 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-all"
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

export default Events;
