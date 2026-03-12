import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const AdminCertificateVerification = () => {
  const [pendingCertificates, setPendingCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingCertificates();
  }, []);

  const fetchPendingCertificates = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin Token:', adminToken);
      console.log('Fetching from:', 'http://localhost:5000/api/certificates/pending');
      const { data } = await axios.get('http://localhost:5000/api/certificates/pending', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('Pending certificates received:', data);
      console.log('Number of certificates:', data.length);
      setPendingCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (certId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.patch(`http://localhost:5000/api/certificates/${certId}/verify`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      alert('Certificate verified successfully!');
      fetchPendingCertificates();
    } catch (error) {
      console.error('Error verifying certificate:', error);
      alert('Failed to verify certificate');
    }
  };

  const handleReject = async (certId) => {
    if (!window.confirm('Are you sure you want to reject this certificate?')) return;
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.patch(`http://localhost:5000/api/certificates/${certId}/reject`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      alert('Certificate rejected');
      fetchPendingCertificates();
    } catch (error) {
      console.error('Error rejecting certificate:', error);
      alert('Failed to reject certificate');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Certificate Verification</h1>
            <p className="text-neutral-600">Review and verify volunteer certificates</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="bg-neutral-600 text-white px-6 py-2 rounded-lg hover:bg-neutral-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        {pendingCertificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Pending Certificates</h3>
            <p className="text-neutral-500">All certificates have been reviewed</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingCertificates.map((cert) => (
              <div key={cert._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Award className="w-7 h-7 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">{cert.volunteerName}</h3>
                        <p className="text-sm text-neutral-500">Volunteer ID: {cert.volunteerId}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-semibold mb-1">🎯 Event Name</p>
                        <p className="font-semibold text-neutral-900">{cert.eventTitle}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>Event Date</span>
                        </div>
                        <p className="font-semibold text-neutral-900">
                          {new Date(cert.eventDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 text-xs text-green-600 font-semibold mb-1">
                          <Clock className="w-3 h-3" />
                          <span>Hours Contributed</span>
                        </div>
                        <p className="font-semibold text-neutral-900">{cert.hoursContributed} hours</p>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <p className="text-xs text-neutral-600 font-semibold mb-1">🆔 Certificate ID</p>
                        <p className="font-mono text-sm font-semibold text-neutral-900">{cert.certificateId}</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-700">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Status: Pending Admin Verification</span>
                      </div>
                      <p className="text-sm text-amber-600 mt-2">Certificate auto-generated after volunteer check-in. Please verify to enable download.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => handleVerify(cert._id)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Verify Certificate
                    </button>
                    <button
                      onClick={() => handleReject(cert._id)}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-all font-semibold"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => window.open(`/certificates/${cert.certificateId}`, '_blank')}
                      className="flex items-center justify-center gap-2 bg-neutral-600 text-white px-6 py-3 rounded-lg hover:bg-neutral-700 transition-all text-sm"
                    >
                      👁 Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCertificateVerification;
