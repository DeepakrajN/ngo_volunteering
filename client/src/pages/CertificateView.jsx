import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CertificateView = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef();

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCertificate = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/certificates/${certificateId}`);
      setCertificate(data);
    } catch (error) {
      console.error('Error fetching certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    const element = certRef.current;
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(element, { scale: 3, backgroundColor: '#ffffff' }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Certificate-${certificate.volunteerName.replace(/\s+/g, '-')}-${certificateId}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      });
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!certificate) return <div className="flex justify-center items-center h-screen">Certificate not found</div>;
  if (certificate.status !== 'verified') return <div className="flex justify-center items-center h-screen">Certificate not verified yet</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div ref={certRef} className="bg-white p-16 shadow-2xl relative overflow-hidden" style={{ aspectRatio: '1.414/1' }}>
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'rotate(-45deg)' }}>
            <div className="text-9xl font-bold text-neutral-100 opacity-30 whitespace-nowrap" style={{ fontSize: '8rem', letterSpacing: '0.5rem' }}>
              HELPING HANDS
            </div>
          </div>
          
          {/* Decorative Border */}
          <div className="absolute inset-4 border-4 border-double border-primary-600"></div>
          <div className="absolute inset-6 border border-primary-400"></div>
          
          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary-600"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary-600"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary-600"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary-600"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between py-8">
            {/* Header */}
            <div className="text-center">
              <div className="mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Helping Hands
                </h2>
                <p className="text-sm text-neutral-600 mb-4">NGO Volunteer Platform</p>
                <div className="text-6xl mb-2">🏆</div>
                <h1 className="text-5xl font-serif font-bold text-primary-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Certificate of Appreciation
                </h1>
                <div className="flex justify-center items-center gap-2 mt-3">
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent"></div>
                  <div className="w-3 h-3 bg-primary-600 rotate-45"></div>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent"></div>
                </div>
              </div>
              <p className="text-lg text-neutral-600 italic">Presented to</p>
            </div>
            
            {/* Main Content */}
            <div className="text-center my-8">
              <h2 className="text-5xl font-serif font-bold text-neutral-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                {certificate.volunteerName}
              </h2>
              <p className="text-xl text-neutral-700 mb-4 leading-relaxed max-w-2xl mx-auto">
                For outstanding dedication and valuable contribution as a volunteer in
              </p>
              <h3 className="text-3xl font-semibold text-primary-700 mb-6 px-8">
                {certificate.eventTitle}
              </h3>
              <p className="text-lg text-neutral-600">
                Held on <span className="font-semibold">{new Date(certificate.eventDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
              {certificate.hoursContributed > 0 && (
                <p className="text-lg text-neutral-600 mt-3">
                  Contributing <span className="font-semibold text-primary-600">{certificate.hoursContributed} hours</span> of volunteer service
                </p>
              )}
              {certificate.eventOrganizer && (
                <p className="text-md text-neutral-600 mt-4">
                  Organized by <span className="font-semibold text-neutral-800">{certificate.eventOrganizer}</span>
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end px-8">
              <div className="text-center">
                <div className="w-48 border-t-2 border-neutral-800 mb-2"></div>
                <p className="text-sm font-semibold text-neutral-700">Authorized Signature</p>
                <p className="text-xs text-neutral-500">Helping Hands NGO</p>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <div className="w-20 h-20 mx-auto mb-2 border-2 border-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="text-xs text-neutral-500">Verified</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-600 mb-1">Certificate ID</p>
                <p className="font-mono text-xs font-semibold text-neutral-800">{certificate.certificateId}</p>
                <p className="text-xs text-neutral-500 mt-2">
                  Issued: {new Date(certificate.issuedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 flex gap-4 justify-center">
          <button
            onClick={downloadCertificate}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg"
          >
            📥 Download Certificate
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-neutral-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-700 transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
