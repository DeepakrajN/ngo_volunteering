import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Occupation', 'Availability'];
    const rows = filtered.map(v => [
      v.name || '',
      v.email || '',
      v.phone || '',
      v.currentLocation || v.city || '',
      v.occupation || '',
      v.availability || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'volunteers.csv';
    a.click();
  };

  useEffect(() => {
    fetch('/api/volunteers')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then((j) => {
        setVolunteers(j);
        setFiltered(j);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching volunteers:', err);
        setError('Failed to load volunteers');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = volunteers;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(v => 
        (v.name || '').toLowerCase().includes(q) || 
        (v.currentLocation || v.city || '').toLowerCase().includes(q) || 
        (v.interests || []).some(i => i.toLowerCase().includes(q)) ||
        (v.occupation || '').toLowerCase().includes(q)
      );
    }
    if (filterAvailability !== 'all') {
      result = result.filter(v => v.availability === filterAvailability);
    }
    result.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'location') return (a.currentLocation || '').localeCompare(b.currentLocation || '');
      return 0;
    });
    setFiltered(result);
  }, [query, volunteers, filterAvailability, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Our Volunteers</h1>
          <p className="text-lg text-neutral-600">Connect with passionate individuals making a difference</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, location, interests, or occupation..."
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="all">All Availability</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Weekends">Weekends</option>
                <option value="Flexible">Flexible</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              Showing {filtered.length} of {volunteers.length} volunteers
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">No volunteers found</h3>
            <p className="text-neutral-600">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((v, i) => (
              <motion.div
                key={v._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-neutral-200"
                onClick={() => setSelected(v)}
              >
                <div className="h-24 bg-gradient-to-br from-primary-500 to-primary-700"></div>
                <div className="p-6 -mt-12">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white">
                    <span className="text-2xl font-bold text-primary-600">
                      {v.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 text-center mb-1">{v.name}</h3>
                  <p className="text-sm text-neutral-500 text-center mb-3">{v.occupation || 'Volunteer'}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-neutral-600">
                      <span className="mr-2">📍</span>
                      <span className="truncate">{v.currentLocation || v.city || 'Location not set'}</span>
                    </div>
                    {v.availability && (
                      <div className="flex items-center text-neutral-600">
                        <span className="mr-2">⏰</span>
                        <span>{v.availability}</span>
                      </div>
                    )}
                    {v.interests && v.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {v.interests.slice(0, 2).map((interest, idx) => (
                          <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                            {interest}
                          </span>
                        ))}
                        {v.interests.length > 2 && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                            +{v.interests.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 text-white">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl font-bold text-primary-600">
                    {selected.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">{selected.name}</h3>
                <p className="text-center text-white/90">{selected.occupation || 'Volunteer'}</p>
              </div>
              
              <div className="p-8">
                <div className="mb-6 bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <p className="text-sm text-primary-600 font-semibold">Volunteer ID</p>
                  <p className="text-2xl font-bold text-primary-700">{selected.volunteerId || 'N/A'}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                      <span className="mr-2">📧</span> Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-neutral-700"><strong>Email:</strong> {selected.email}</p>
                      {selected.phone && <p className="text-neutral-700"><strong>Phone:</strong> {selected.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                      <span className="mr-2">📍</span> Location
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selected.currentLocation && <p className="text-neutral-700"><strong>Current:</strong> {selected.currentLocation}</p>}
                      {selected.nativeLocation && <p className="text-neutral-700"><strong>Native:</strong> {selected.nativeLocation}</p>}
                      {selected.address && <p className="text-neutral-700"><strong>Address:</strong> {selected.address}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                      <span className="mr-2">👤</span> Personal Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selected.age && <p className="text-neutral-700"><strong>Age:</strong> {selected.age}</p>}
                      {selected.bloodGroup && <p className="text-neutral-700"><strong>Blood Group:</strong> {selected.bloodGroup}</p>}
                      {selected.maritalStatus && <p className="text-neutral-700"><strong>Marital Status:</strong> {selected.maritalStatus}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                      <span className="mr-2">💼</span> Professional
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selected.occupation && <p className="text-neutral-700"><strong>Occupation:</strong> {selected.occupation}</p>}
                      {selected.educationalQualification && <p className="text-neutral-700"><strong>Education:</strong> {selected.educationalQualification}</p>}
                    </div>
                  </div>

                  {selected.interests && selected.interests.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                        <span className="mr-2">🎯</span> Interests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selected.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.availability && (
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                        <span className="mr-2">⏰</span> Availability
                      </h4>
                      <p className="text-neutral-700">{selected.availability}</p>
                    </div>
                  )}

                  {selected.hobby && (
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                        <span className="mr-2">🎨</span> Hobbies
                      </h4>
                      <p className="text-neutral-700">{selected.hobby}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-4">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold text-center transition-all"
                  >
                    Send Email
                  </a>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-8 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-all"
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

export default Volunteers;
