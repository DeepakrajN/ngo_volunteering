import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { eventAPI, announcementAPI } from '../api';
import ImageUploader from '../components/ImageUploader';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [pendingCertCount, setPendingCertCount] = useState(0);
  const [newClub, setNewClub] = useState({ name: '', description: '', category: '', image: '' });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    Headedby: '',
    image: '',
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });
  const [newGalleryImage, setNewGalleryImage] = useState({
    title: '',
    url: '',
    description: '',
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [eventError, setEventError] = useState('');
  const [announcementError, setAnnouncementError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchAnnouncements();
    fetchVolunteers();
    fetchGalleryImages();
    fetchClubs();
    fetchPendingCertificates();
  }, []);

  const fetchPendingCertificates = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await api.get('/certificates/pending', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setPendingCertCount(response.data.length);
    } catch (error) {
      console.error('Error fetching pending certificates:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEventError('Failed to load events. Please check your connection.');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementAPI.getAnnouncements();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncementError('Failed to load announcements. Please check your connection.');
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await api.get('/volunteers');
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const response = await api.get('/gallery');
      setGalleryImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await api.get('/clubs');
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEventError('');
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) throw new Error('Admin token not found. Please login as admin.');

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, newEvent, { headers: { Authorization: `Bearer ${adminToken}` } });
        setEditingEvent(null);
      } else {
        await api.post('/events', newEvent, { headers: { Authorization: `${adminToken}` } });
      }
      setNewEvent({ title: '', description: '', date: '', location: '', Headedby: '', image: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      setEventError(error.response?.data?.message || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnnouncementError('');
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) throw new Error('Admin token not found. Please login as admin.');

      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement._id}`, newAnnouncement, { headers: { Authorization: `Bearer ${adminToken}` } });
        setEditingAnnouncement(null);
      } else {
        await api.post('/announcements', newAnnouncement, { headers: { Authorization: `Bearer ${adminToken}` } });
      }
      setNewAnnouncement({ title: '', content: '' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      setAnnouncementError(error.response?.data?.message || 'Failed to save announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      location: event.location,
      Headedby: event.Headedby,
      image: event.image || '',
    });
  };

  const handleAnnouncementEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
    });
  };

  const handleEventDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventAPI.deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      setEventError('Failed to delete event. Please try again.');
    }
  };

  const handleAnnouncementDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await announcementAPI.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setAnnouncementError('Failed to delete announcement. Please try again.');
    }
  };

  const handleVolunteerDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
    try {
      await api.delete(`/volunteers/${id}`);
      fetchVolunteers();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
    }
  };

  const handleGalleryImageAdd = async (e) => {
    e.preventDefault();
    if (!newGalleryImage.url) {
      alert('Please upload an image first!');
      return;
    }
    try {
      console.log('Adding gallery image:', newGalleryImage);
      await api.post('/gallery', newGalleryImage);
      alert('Image added successfully!');
      setNewGalleryImage({ title: '', url: '', description: '' });
      fetchGalleryImages();
    } catch (error) {
      console.error('Error adding gallery image:', error);
      alert(`Failed to add image: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleGalleryImageDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
    }
  };

  const handleClubAdd = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending club data:', newClub);
      const response = await api.post('/clubs', newClub);
      console.log('Club added successfully:', response.data);
      alert('Club added successfully!');
      setNewClub({ name: '', description: '', category: '', image: '' });
      fetchClubs();
    } catch (error) {
      console.error('Error adding club:', error);
      alert(`Failed to add club: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleClubDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await api.delete(`/clubs/${id}`);
      fetchClubs();
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-dark-100">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'events' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'announcements' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'volunteers' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            Volunteers
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'gallery' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'clubs' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            Clubs
          </button>
          <button
            onClick={() => navigate('/admin/certificates')}
            className="px-6 py-3 rounded-lg font-semibold bg-dark-700 text-dark-300 hover:bg-dark-600 transition-all relative"
          >
            Certificates
            {pendingCertCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {pendingCertCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'events' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-dark-100">Manage Events</h2>

            <form onSubmit={handleEventSubmit} className="bg-dark-800 shadow-lg rounded-lg p-6 mb-6 border border-dark-700">
              <h3 className="text-lg font-semibold mb-4 text-dark-100">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              {eventError && <p className="text-red-400 mb-4">{eventError}</p>}
              <div className="mb-4">
                <label htmlFor="eventTitle" className="block text-sm font-medium text-dark-300">
                  Title
                </label>
                <input
                  type="text"
                  id="eventTitle"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Enter event title"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-sm font-medium text-dark-300">
                  Description
                </label>
                <textarea
                  id="eventDescription"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Enter event description"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="eventDate" className="block text-sm font-medium text-dark-300">
                  Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="eventLocation" className="block text-sm font-medium text-dark-300">
                  Location
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Enter event location"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="eventHeadedby" className="block text-sm font-medium text-dark-300">
                  Headed by
                </label>
                <input
                  type="text"
                  id="eventHeadedby"
                  value={newEvent.Headedby}
                  onChange={(e) => setNewEvent({ ...newEvent, Headedby: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Enter event organizer"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Event Image
                </label>
                <ImageUploader
                  onImageSelect={(image) => setNewEvent({ ...newEvent, image })}
                  currentImage={newEvent.image}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition"
              >
                {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Add Event')}
              </button>
              {editingEvent && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setNewEvent({ title: '', description: '', date: '', location: '', Headedby: '', image: '' });
                  }}
                  className="w-full mt-2 bg-dark-600 text-white px-4 py-2 rounded-md hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-500 focus:ring-offset-2 transition"
                >
                  Cancel
                </button>
              )}
            </form>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event._id} className="bg-dark-800 shadow-lg rounded-lg p-4 border border-dark-700">
                  <div className="flex gap-4">
                    {event.image && (
                      <img src={event.image} alt={event.title} className="w-24 h-24 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-dark-100">{event.title}</h3>
                      <p className="text-dark-400 mb-2">{event.description}</p>
                      <p className="text-sm text-dark-500 mb-2">
                        Date: {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-dark-500 mb-4">Location: {event.location}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <a
                      href={`/admin/events/${event._id}/attendance`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition inline-block text-center"
                    >
                      Attendance ({event.registeredVolunteers?.length || 0})
                    </a>
                    <button
                      onClick={() => handleEventEdit(event)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleEventDelete(event._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-dark-100">Manage Announcements</h2>

            <form onSubmit={handleAnnouncementSubmit} className="bg-dark-800 shadow-lg rounded-lg p-6 mb-6 border border-dark-700">
              <h3 className="text-lg font-semibold mb-4 text-dark-100">
                {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
              </h3>
              {announcementError && <p className="text-red-400 mb-4">{announcementError}</p>}
              <div className="mb-4">
                <label htmlFor="announcementTitle" className="block text-sm font-medium text-dark-300">
                  Title
                </label>
                <input
                  type="text"
                  id="announcementTitle"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="announcementContent" className="block text-sm font-medium text-dark-300">
                  Content
                </label>
                <textarea
                  id="announcementContent"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="Enter announcement content"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition"
              >
                {loading ? 'Saving...' : (editingAnnouncement ? 'Update Announcement' : 'Add Announcement')}
              </button>
              {editingAnnouncement && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setNewAnnouncement({ title: '', content: '' });
                  }}
                  className="w-full mt-2 bg-dark-600 text-white px-4 py-2 rounded-md hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-500 focus:ring-offset-2 transition"
                >
                  Cancel
                </button>
              )}
            </form>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="bg-dark-800 shadow-lg rounded-lg p-4 border border-dark-700">
                  <h3 className="text-lg font-semibold text-dark-100">{announcement.title}</h3>
                  <p className="text-dark-400 mb-4">{announcement.content}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAnnouncementEdit(announcement)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAnnouncementDelete(announcement._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="bg-dark-800 shadow-lg rounded-lg p-6 border border-dark-700">
            <h2 className="text-2xl font-bold mb-6 text-dark-100">Manage Volunteers</h2>
            <div className="space-y-4">
              {volunteers.map((volunteer) => (
                <div key={volunteer._id} className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-dark-100">{volunteer.name}</h3>
                      <p className="text-sm text-dark-400">ID: {volunteer.volunteerId}</p>
                      <p className="text-sm text-dark-400">Email: {volunteer.email}</p>
                      <p className="text-sm text-dark-400">Phone: {volunteer.phone}</p>
                      <p className="text-sm text-dark-400">Location: {volunteer.currentLocation || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => handleVolunteerDelete(volunteer._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-dark-100">Manage Gallery</h2>
            <form onSubmit={handleGalleryImageAdd} className="bg-dark-800 shadow-lg rounded-lg p-6 mb-6 border border-dark-700">
              <h3 className="text-lg font-semibold mb-4 text-dark-100">Add New Image</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newGalleryImage.title}
                  onChange={(e) => setNewGalleryImage({ ...newGalleryImage, title: e.target.value })}
                  required
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                  placeholder="Enter image title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Image</label>
                <ImageUploader
                  onImageSelect={(url) => setNewGalleryImage({ ...newGalleryImage, url })}
                  currentImage={newGalleryImage.url}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
                <input
                  type="text"
                  value={newGalleryImage.description}
                  onChange={(e) => setNewGalleryImage({ ...newGalleryImage, description: e.target.value })}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                  placeholder="Enter image description"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Add Image
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image._id} className="bg-dark-800 rounded-lg overflow-hidden border border-dark-700">
                  <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-dark-100 mb-2">{image.title}</h3>
                    <p className="text-sm text-dark-400 mb-4">{image.description}</p>
                    <button
                      onClick={() => handleGalleryImageDelete(image._id)}
                      className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clubs' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-dark-100">Manage Clubs</h2>
            <form onSubmit={handleClubAdd} className="bg-dark-800 shadow-lg rounded-lg p-6 mb-6 border border-dark-700">
              <h3 className="text-lg font-semibold mb-4 text-dark-100">Add New Club</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Club Name</label>
                <input
                  type="text"
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  required
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                  placeholder="Enter club name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Category</label>
                <input
                  type="text"
                  value={newClub.category}
                  onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                  required
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                  placeholder="e.g., Environment, Education, Health"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
                <textarea
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  required
                  rows="3"
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                  placeholder="Enter club description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Club Image</label>
                <ImageUploader
                  onImageSelect={(image) => setNewClub({ ...newClub, image })}
                  currentImage={newClub.image}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Add Club
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs.map((club) => (
                <div key={club._id} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                  <h3 className="font-semibold text-dark-100 mb-2">{club.name}</h3>
                  <p className="text-sm text-dark-400 mb-2">{club.category}</p>
                  <p className="text-sm text-dark-400 mb-3">{club.description}</p>
                  <div className="flex items-center text-sm text-dark-500 mb-4">
                    <span className="mr-2">👥</span>
                    <span>{club.members?.length || 0} members</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/admin/clubs/${club._id}/manage`}
                      className="flex-1 bg-primary-600 text-white px-3 py-2 rounded hover:bg-primary-700 transition text-center"
                    >
                      Manage
                    </a>
                    <button
                      onClick={() => handleClubDelete(club._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
