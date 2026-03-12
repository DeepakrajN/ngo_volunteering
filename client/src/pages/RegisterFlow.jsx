import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Step = ({ number, title, children }) => (
  <div className={`p-6 bg-white rounded-lg shadow-md ${number === 1 ? '' : ''}`}>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default function RegisterFlow() {
  const { login, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    skills: '',
    age: '',
    bloodGroup: '',
    address: '',
    occupation: '',
    interests: '',
    availability: '',
    hobby: '',
    maritalStatus: '',
    educationalQualification: '',
    nativeLocation: '',
    currentLocation: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!data.name.trim()) e.name = 'Name is required';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = 'Enter a valid email';
    }
    if (s === 2) {
      if (!/^[0-9]{7,15}$/.test(data.phone)) e.phone = 'Enter a valid phone number';
      if (data.password.length < 6) e.password = 'Password must be at least 6 characters';
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(3, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleFinish = async (e) => {
    e.preventDefault();
    setServerError(null);
    setLoading(true);
    try {
      const submitData = {
        ...data,
        interests: data.interests.split(',').map(i => i.trim()).filter(i => i),
        age: parseInt(data.age),
      };
      const res = await fetch('/api/volunteers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Registration failed');
      // Use auth context to set user data and login
      if (json.token && json.user) {
        login(json.user, json.token);
        navigate('/');
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round((step - 1) / 2 * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-indigo-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Join Helping Hands</h1>
          <p className="text-indigo-100">Three quick steps to become a volunteer.</p>
        </motion.div>

        <div className="bg-white p-6 rounded-b-lg shadow-lg">
          <div className="mb-6">
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <div>Step 1</div>
              <div>Step 2</div>
              <div>Step 3</div>
            </div>
          </div>

          {serverError && <div className="mb-4 text-red-600">{serverError}</div>}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.24 }}>
                <Step number={1} title="Personal Info">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full name</label>
                      <input name="name" value={data.name} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input name="email" value={data.email} onChange={handleChange} type="email" className="mt-1 block w-full p-2 border rounded" />
                      {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    </div>
                    <div className="flex justify-end mt-4">
                      <motion.button whileTap={{ scale: 0.98 }} onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded">Next</motion.button>
                    </div>
                  </div>
                </Step>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.24 }}>
                <Step number={2} title="Contact & Security">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input name="phone" value={data.phone} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input name="password" value={data.password} onChange={handleChange} type="password" className="mt-1 block w-full p-2 border rounded" />
                      {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                    </div>
                    <div className="flex justify-between mt-4">
                      <motion.button whileTap={{ scale: 0.98 }} onClick={prev} className="px-4 py-2 border rounded">Back</motion.button>
                      <motion.button whileTap={{ scale: 0.98 }} onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded">Next</motion.button>
                    </div>
                  </div>
                </Step>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.24 }}>
                <Step number={3} title="Profile Details">
                  <form onSubmit={handleFinish}>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input name="age" value={data.age} onChange={handleChange} type="number" className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                        <input name="bloodGroup" value={data.bloodGroup} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input name="address" value={data.address} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Occupation</label>
                        <input name="occupation" value={data.occupation} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Interests (comma separated)</label>
                        <input name="interests" value={data.interests} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Availability</label>
                        <input name="availability" value={data.availability} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hobby</label>
                        <input name="hobby" value={data.hobby} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                        <input name="maritalStatus" value={data.maritalStatus} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Educational Qualification</label>
                        <input name="educationalQualification" value={data.educationalQualification} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Native Location</label>
                        <input name="nativeLocation" value={data.nativeLocation} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Location</label>
                        <input name="currentLocation" value={data.currentLocation} onChange={handleChange} className="mt-1 block w-full p-2 border rounded" />
                      </div>
                      <div className="flex justify-between mt-4">
                        <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={prev} className="px-4 py-2 border rounded">Back</motion.button>
                        <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
                          {loading ? 'Creating...' : 'Finish & Join'}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </Step>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
