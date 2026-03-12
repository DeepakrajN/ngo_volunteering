import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const EventAttendance = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventAndAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEventAndAttendance = async () => {
    try {
      const [eventRes, attendanceRes] = await Promise.all([
        api.get(`/events`),
        api.get(`/events/${eventId}/attendance`)
      ]);
      
      const currentEvent = eventRes.data.find(e => e._id === eventId);
      setEvent(currentEvent);
      setRegisteredVolunteers(attendanceRes.data.registeredVolunteers || []);
      setAttendance(attendanceRes.data.attendance || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const markAttendance = async (volunteerId, status) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      await api.post('/events/attendance', 
        { eventId, volunteerId, status },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      fetchEventAndAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const generateCertificate = async (volunteer) => {
    const hours = prompt('Enter hours contributed:', '4');
    if (!hours) return;
    try {
      const adminToken = localStorage.getItem('adminToken');
      await api.post('/certificates/generate',
        {
          eventId,
          volunteerId: volunteer.volunteerId,
          volunteerName: volunteer.name,
          hoursContributed: parseInt(hours)
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      alert('Certificate request submitted for verification!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert(error.response?.data?.message || 'Failed to generate certificate');
    }
  };

  const getAttendanceStatus = (volunteerId) => {
    const record = attendance.find(a => a.volunteerId === volunteerId);
    return record?.status || 'absent';
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
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 text-primary-600 hover:text-primary-700 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{event?.title}</h1>
          <p className="text-neutral-600 mb-4">{new Date(event?.date).toLocaleDateString()}</p>
          <div className="flex gap-4 text-sm">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {registeredVolunteers.length} Registered
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {attendance.filter(a => a.status === 'present').length} Present
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Mark Attendance</h2>
          
          {registeredVolunteers.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No volunteers registered yet</p>
          ) : (
            <div className="space-y-4">
              {registeredVolunteers.map((volunteer) => {
                const attendanceRecord = attendance.find(a => a.volunteerId === volunteer.volunteerId);
                const hasCheckedIn = attendanceRecord?.checkInData;
                return (
                  <div key={volunteer.volunteerId} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{volunteer.name}</h3>
                        <p className="text-sm text-neutral-600">{volunteer.email}</p>
                        <p className="text-sm text-neutral-600">{volunteer.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAttendance(volunteer.volunteerId, 'present')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            getAttendanceStatus(volunteer.volunteerId) === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-neutral-200 text-neutral-700 hover:bg-green-100'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(volunteer.volunteerId, 'absent')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            getAttendanceStatus(volunteer.volunteerId) === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-neutral-200 text-neutral-700 hover:bg-red-100'
                          }`}
                        >
                          Absent
                        </button>
                        {getAttendanceStatus(volunteer.volunteerId) === 'present' && (
                          <button
                            onClick={() => generateCertificate(volunteer)}
                            className="px-4 py-2 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all"
                          >
                            🏆 Certificate
                          </button>
                        )}
                      </div>
                    </div>
                    {hasCheckedIn && (
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                          <span>✓</span>
                          <span className="font-semibold">Self Check-In Verified</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="font-semibold text-blue-900">Location</p>
                            <p className="text-blue-700">
                              {hasCheckedIn.location?.latitude.toFixed(4)}, {hasCheckedIn.location?.longitude.toFixed(4)}
                            </p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <p className="font-semibold text-purple-900">Photos</p>
                            <p className="text-purple-700">{hasCheckedIn.photos?.length || 0} uploaded</p>
                          </div>
                        </div>
                        {hasCheckedIn.photos && hasCheckedIn.photos.length > 0 && (
                          <div className="mt-2 flex gap-2 overflow-x-auto">
                            {hasCheckedIn.photos.map((photo, idx) => (
                              <img key={idx} src={photo} alt={`Check-in ${idx + 1}`} className="h-16 w-16 object-cover rounded" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAttendance;
