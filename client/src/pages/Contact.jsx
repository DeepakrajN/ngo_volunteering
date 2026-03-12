import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-2">
              <strong>Phone:</strong>{' '}
              <a href="tel:+919488868329" className="text-primary-600 hover:underline">+91 94888 68329</a>
            </p>
            <p className="mb-2">
              <strong>WhatsApp:</strong>{' '}
              <a
                href="https://wa.me/919488868329?text=Hello%20Helping%20Hands!%20I%20want%20to%20learn%20more"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                Chat on WhatsApp
              </a>
            </p>
            <p className="mb-2">
              <strong>Email:</strong> <a href="mailto:deepakrj2006@gmail.com" className="text-primary-600 hover:underline">info@helpinghandsngo.org</a>
            </p>
            <p>
              <strong>Address:</strong> 123 Helping Street, Compassion City, HC 12345
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Submission failed');
      setStatus({ loading: false, success: 'Message sent — thank you!', error: null });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message || 'Submission failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input name="name" value={form.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </motion.div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={status.loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        {status.loading ? 'Sending...' : 'Send Message'}
      </motion.button>

      {status.success && <div className="text-green-600">{status.success}</div>}
      {status.error && <div className="text-red-600">{status.error}</div>}
    </form>
  );
}
