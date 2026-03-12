import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import ImageUploader from '../components/ImageUploader';

const EventCheckIn = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [location, setLocation] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  useEffect(() => {
    fetchEventAndCheckStatus();
    getLocation();
  }, [eventId]);

  const fetchEventAndCheckStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to check in');
        setLoading(false);
        return;
      }

      const [eventRes, volunteerRes] = await Promise.all([
        api.get('/events'),
        api.get('/volunteers/me', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const currentEvent = eventRes.data.find(e => e._id === eventId);
      setEvent(currentEvent);

      const volunteerId = volunteerRes.data.volunteerId || volunteerRes.data._id;
      const registered = currentEvent?.registeredVolunteers?.some(v => v.volunteerId === volunteerId);
      const checkedIn = currentEvent?.attendance?.some(a => a.volunteerId === volunteerId);

      setIsRegistered(registered);
      setAlreadyCheckedIn(checkedIn);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load event');
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        setLocationError('Location access denied. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCheckIn = async () => {
    if (!location) {
      setError('Location is required for check-in');
      return;
    }

    if (photos.length === 0) {
      setError('Please upload at least one photo');
      return;
    }

    setChecking(true);
    try {
      const token = localStorage.getItem('token');
      const volunteerRes = await api.get('/volunteers/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const volunteerId = volunteerRes.data.volunteerId || volunteerRes.data._id;

      const deviceInfo = `${navigator.userAgent} | ${navigator.platform}`;

      await api.post('/events/check-in', {
        eventId,
        volunteerId,
        location,
        photos,
        deviceInfo,
      });

      alert('✅ Check-in successful! Attendance marked.');
      navigate('/events');
    } catch (error) {
      setError(error.response?.data?.message || 'Check-in failed');
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12 flex items-center justify-center">
        <div className="text-6xl">⏳</div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">Not Registered</h1>
          <p className="text-neutral-600 mb-6">You must register for this event before checking in.</p>
          <button onClick={() => navigate('/events')} className="bg-primary-600 text-white px-6 py-3 rounded-lg">
            Go to Events
          </button>
        </div>
      </div>
    );
  }

  if (alreadyCheckedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-4">Already Checked In</h1>
          <p className="text-neutral-600 mb-6">You have already checked in to this event.</p>
          <button onClick={() => navigate('/events')} className="bg-primary-600 text-white px-6 py-3 rounded-lg">
            Go to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Event Check-In</h1>
          <h2 className="text-xl text-neutral-700 mb-6">{event?.title}</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Location Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>📍</span> Location Verification
            </h3>
            {location ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold mb-2">✓ Location Captured</p>
                <p className="text-sm text-green-700">
                  Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                </p>
                <p className="text-sm text-green-700">Accuracy: ±{location.accuracy.toFixed(0)}m</p>
              </div>
            ) : locationError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">✗ Location Error</p>
                <p className="text-sm text-red-700">{locationError}</p>
                <button
                  onClick={getLocation}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Retry Location
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">Getting location...</p>
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>📸</span> Event Photos (Required)
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Upload photos from the event to verify your attendance
            </p>
            
            <div className="space-y-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {photos.length < 5 && (
                <ImageUploader
                  onImageSelect={(image) => setPhotos([...photos, image])}
                  currentImage=""
                />
              )}
            </div>
            
            <p className="text-sm text-neutral-500 mt-2">
              {photos.length}/5 photos uploaded
            </p>
          </div>

          {/* Device Info */}
          <div className="mb-8 bg-neutral-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-2">Device Information</h3>
            <p className="text-xs text-neutral-600">
              Platform: {navigator.platform} | Browser: {navigator.userAgent.split(' ').slice(-1)[0]}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              This information is recorded for security and verification purposes.
            </p>
          </div>

          {/* Check-In Button */}
          <div className="flex gap-4">
            <button
              onClick={handleCheckIn}
              disabled={!location || photos.length === 0 || checking}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white py-4 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
            >
              {checking ? 'Checking In...' : '✓ Complete Check-In'}
            </button>
            <button
              onClick={() => navigate('/events')}
              className="px-8 py-4 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-neutral-500 text-center mt-4">
            By checking in, you confirm your attendance and agree to share your location and photos for verification.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EventCheckIn;
