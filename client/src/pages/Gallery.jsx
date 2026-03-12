import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageGallery from '../components/ImageGallery';
import api from '../api';

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get('/gallery');
        const formattedImages = response.data.map(img => ({
          id: img._id,
          url: img.url,
          title: img.title
        }));
        setImages(formattedImages);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Photo Gallery</h1>
          <p className="text-lg text-neutral-600">Moments captured from our volunteer activities and community events</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ImageGallery images={images} />
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;
