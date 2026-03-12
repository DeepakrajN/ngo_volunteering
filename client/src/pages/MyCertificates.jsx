import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, Download, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.volunteerId) {
      fetchCertificates();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching certificates for:', user.volunteerId);
      console.log('Token:', token);
      const { data } = await axios.get(
        `http://localhost:5000/api/certificates/volunteer/${user.volunteerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Certificates received:', data);
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading certificates...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Certificates</h1>
          <p className="text-neutral-600">View and download your volunteer certificates</p>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Certificates Yet</h3>
            <p className="text-neutral-500">Attend events to earn certificates</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/certificates/${cert.certificateId}`)}
              >
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white">
                  <Award className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-1">{cert.eventTitle}</h3>
                  <p className="text-primary-100 text-sm">Certificate of Appreciation</p>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-neutral-600 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {new Date(cert.eventDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  {cert.hoursContributed > 0 && (
                    <div className="flex items-center text-neutral-600 mb-3">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{cert.hoursContributed} hours</span>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500 mb-1">Certificate ID</p>
                    <p className="text-xs font-mono text-neutral-700">{cert.certificateId}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/certificates/${cert.certificateId}`);
                    }}
                    className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    View & Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;
