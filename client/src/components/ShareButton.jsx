import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShareButton = ({ title, text, url }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text || title);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
      >
        <span>📤</span>
        <span>Share</span>
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 min-w-[200px] z-50"
          >
            <div className="space-y-2">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span className="text-xl">📘</span>
                <span className="font-medium text-neutral-700">Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sky-50 rounded-lg transition-colors"
              >
                <span className="text-xl">🐦</span>
                <span className="font-medium text-neutral-700">Twitter</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span className="text-xl">💼</span>
                <span className="font-medium text-neutral-700">LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-green-50 rounded-lg transition-colors"
              >
                <span className="text-xl">💬</span>
                <span className="font-medium text-neutral-700">WhatsApp</span>
              </button>
              <div className="border-t border-neutral-200 my-2"></div>
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <span className="text-xl">{copied ? '✅' : '🔗'}</span>
                <span className="font-medium text-neutral-700">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
