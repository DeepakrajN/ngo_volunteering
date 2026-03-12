import React from 'react';
import { Link } from 'react-router-dom';

const LoginTypeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Choose Login Type</h2>
        <div className="space-y-4">
          <Link
            to="/login"
            onClick={onClose}
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-300"
          >
            Volunteer Login
          </Link>
          <Link
            to="/admin-login"
            onClick={onClose}
            className="block w-full bg-secondary-600 hover:bg-secondary-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-300"
          >
            Admin Login
          </Link>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full text-gray-600 hover:text-gray-800 transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginTypeModal;
