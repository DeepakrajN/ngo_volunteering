import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const AdminClubManage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [activeSection, setActiveSection] = useState('meetings');
  
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', location: '', agenda: '' });
  const [newActivity, setNewActivity] = useState({ title: '', description: '', date: '', status: 'Planned' });
  const [newRequirement, setNewRequirement] = useState({ title: '', description: '', priority: 'Medium' });

  useEffect(() => {
    fetchClub();
  }, [clubId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchClub = async () => {
    try {
      const response = await api.get(`/clubs/${clubId}`);
      setClub(response.data);
    } catch (error) {
      console.error('Error fetching club:', error);
    }
  };

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    try {
      const updatedMeetings = [...(club.meetings || []), newMeeting];
      await api.put(`/clubs/${clubId}`, { meetings: updatedMeetings });
      setNewMeeting({ title: '', date: '', location: '', agenda: '' });
      fetchClub();
    } catch (error) {
      console.error('Error adding meeting:', error);
    }
  };

  const handleDeleteMeeting = async (index) => {
    try {
      const updatedMeetings = club.meetings.filter((_, i) => i !== index);
      await api.put(`/clubs/${clubId}`, { meetings: updatedMeetings });
      fetchClub();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const updatedActivities = [...(club.activities || []), newActivity];
      await api.put(`/clubs/${clubId}`, { activities: updatedActivities });
      setNewActivity({ title: '', description: '', date: '', status: 'Planned' });
      fetchClub();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleDeleteActivity = async (index) => {
    try {
      const updatedActivities = club.activities.filter((_, i) => i !== index);
      await api.put(`/clubs/${clubId}`, { activities: updatedActivities });
      fetchClub();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleAddRequirement = async (e) => {
    e.preventDefault();
    try {
      const updatedRequirements = [...(club.requirements || []), newRequirement];
      await api.put(`/clubs/${clubId}`, { requirements: updatedRequirements });
      setNewRequirement({ title: '', description: '', priority: 'Medium' });
      fetchClub();
    } catch (error) {
      console.error('Error adding requirement:', error);
    }
  };

  const handleDeleteRequirement = async (index) => {
    try {
      const updatedRequirements = club.requirements.filter((_, i) => i !== index);
      await api.put(`/clubs/${clubId}`, { requirements: updatedRequirements });
      fetchClub();
    } catch (error) {
      console.error('Error deleting requirement:', error);
    }
  };

  if (!club) return <div className="min-h-screen bg-gradient-dark p-4 flex items-center justify-center"><div className="text-6xl">⏳</div></div>;

  return (
    <div className="min-h-screen bg-gradient-dark p-4">
      <div className="container mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate('/admin-dashboard')} className="text-primary-400 hover:text-primary-300 mb-4">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-dark-100">Manage: {club.name}</h1>
          <p className="text-dark-400 mt-2">{club.category} | {club.members?.length || 0} Members</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSection('meetings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === 'meetings' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'
            }`}
          >
            Meetings
          </button>
          <button
            onClick={() => setActiveSection('activities')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === 'activities' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveSection('requirements')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === 'requirements' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'
            }`}
          >
            Requirements
          </button>
          <button
            onClick={() => setActiveSection('members')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === 'members' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'
            }`}
          >
            Members
          </button>
        </div>

        {activeSection === 'meetings' && (
          <div>
            <form onSubmit={handleAddMeeting} className="bg-dark-800 rounded-lg p-6 mb-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-dark-100 mb-4">Add Meeting</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Meeting Title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  required
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                />
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  required
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  required
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                />
                <input
                  type="text"
                  placeholder="Agenda"
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                />
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                Add Meeting
              </button>
            </form>
            <div className="space-y-4">
              {club.meetings?.map((meeting, i) => (
                <div key={i} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-dark-100">{meeting.title}</h4>
                      <p className="text-sm text-dark-400 mt-1">📍 {meeting.location} | 🕐 {new Date(meeting.date).toLocaleDateString()}</p>
                      <p className="text-sm text-dark-400 mt-1">{meeting.agenda}</p>
                    </div>
                    <button onClick={() => handleDeleteMeeting(i)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'activities' && (
          <div>
            <form onSubmit={handleAddActivity} className="bg-dark-800 rounded-lg p-6 mb-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-dark-100 mb-4">Add Activity</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Activity Title"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  required
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                />
                <input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                  required
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                />
                <textarea
                  placeholder="Description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black md:col-span-2"
                  rows="2"
                />
                <select
                  value={newActivity.status}
                  onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value })}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                Add Activity
              </button>
            </form>
            <div className="space-y-4">
              {club.activities?.map((activity, i) => (
                <div key={i} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark-100">{activity.title}</h4>
                      <p className="text-sm text-dark-400 mt-1">{activity.description}</p>
                      <p className="text-xs text-dark-500 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.status === 'Completed' ? 'bg-green-600' :
                        activity.status === 'In Progress' ? 'bg-blue-600' : 'bg-yellow-600'
                      } text-white`}>
                        {activity.status}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteActivity(i)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'requirements' && (
          <div>
            <form onSubmit={handleAddRequirement} className="bg-dark-800 rounded-lg p-6 mb-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-dark-100 mb-4">Add Requirement</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Requirement Title"
                  value={newRequirement.title}
                  onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
                  required
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                />
                <select
                  value={newRequirement.priority}
                  onChange={(e) => setNewRequirement({ ...newRequirement, priority: e.target.value })}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-black md:col-span-2"
                  rows="2"
                />
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                Add Requirement
              </button>
            </form>
            <div className="space-y-4">
              {club.requirements?.map((req, i) => (
                <div key={i} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark-100">{req.title}</h4>
                      <p className="text-sm text-dark-400 mt-1">{req.description}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        req.priority === 'High' ? 'bg-red-600' :
                        req.priority === 'Medium' ? 'bg-orange-600' : 'bg-blue-600'
                      } text-white`}>
                        {req.priority}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteRequirement(i)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'members' && (
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">Club Members ({club.members?.length || 0})</h3>
            <div className="space-y-3">
              {club.members?.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{member.name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark-100">{member.name}</p>
                    <p className="text-xs text-dark-400">{member.email} | {member.phone}</p>
                  </div>
                  <span className="text-xs text-dark-500">
                    Joined: {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClubManage;
