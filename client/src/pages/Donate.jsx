import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Donate(){
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDonate = (e) => {
    e.preventDefault();
    // simulate donation
    setTimeout(() => setSuccess(true), 700);
  };

  if(success) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded shadow text-center">
        <div className="text-4xl text-green-600">🎉</div>
        <h2 className="text-2xl font-bold mt-4">Thank you!</h2>
        <p className="mt-2 text-gray-600">Your donation helps us reach more people.</p>
      </motion.div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Support Helping Hands</h1>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded shadow max-w-lg">
        <form onSubmit={handleDonate}>
          <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
          <input value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full p-2 border rounded" placeholder="50" />
          <div className="mt-4 flex justify-end">
            <motion.button whileTap={{ scale: 0.98 }} type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Donate</motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
