import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { volunteerAPI } from '../api';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch detailed profile data from API
      fetch('/api/volunteers/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setProfileData(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Please login to view your profile</div>
      </div>
    );
  }

  const data = profileData || user;

  const handleEdit = () => {
    if (!profileData) {
      alert('Profile data not loaded yet. Please wait.');
      return;
    }
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      const response = await volunteerAPI.updateMe(editData);
      setProfileData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-semibold text-primary-700">
                {data?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">{data?.name}</h1>
            <p className="text-gray-300">{data?.email}</p>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
            {isEditing && (
              <div className="mt-4 space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.age || ''}
                      onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.age || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.phone || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Blood Group</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.bloodGroup || ''}
                      onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.bloodGroup || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Marital Status</label>
                  {isEditing ? (
                    <select
                      value={editData.maritalStatus || ''}
                      onChange={(e) => setEditData({ ...editData, maritalStatus: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  ) : (
                    <p className="text-white">{data?.maritalStatus || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Location Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address || ''}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.address || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Native Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nativeLocation || ''}
                      onChange={(e) => setEditData({ ...editData, nativeLocation: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.nativeLocation || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Current Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.currentLocation || ''}
                      onChange={(e) => setEditData({ ...editData, currentLocation: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.currentLocation || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Professional Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Occupation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.occupation || ''}
                      onChange={(e) => setEditData({ ...editData, occupation: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.occupation || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Educational Qualification</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.educationalQualification || ''}
                      onChange={(e) => setEditData({ ...editData, educationalQualification: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.educationalQualification || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Interests & Availability</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Interests</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.interests?.join(', ') || ''}
                      onChange={(e) => setEditData({ ...editData, interests: e.target.value.split(', ') })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter interests separated by commas"
                    />
                  ) : (
                    <p className="text-white">
                      {data?.interests?.length > 0 ? data.interests.join(', ') : 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Availability</label>
                  {isEditing ? (
                    <select
                      value={editData.availability || ''}
                      onChange={(e) => setEditData({ ...editData, availability: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  ) : (
                    <p className="text-white">{data?.availability || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Hobby</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.hobby || ''}
                      onChange={(e) => setEditData({ ...editData, hobby: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white">{data?.hobby || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
