import React, { useState, useRef, useEffect } from 'react';

const ImageUploader = ({ onImageSelect, currentImage = '' }) => {
  const [uploadMethod, setUploadMethod] = useState('url');
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [imagePreview, setImagePreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          handleFileUpload(file);
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setImagePreview(base64);
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setImagePreview(imageUrl);
      onImageSelect(imageUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            uploadMethod === 'url' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('upload')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            uploadMethod === 'upload' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('paste')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            uploadMethod === 'paste' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Paste
        </button>
      </div>

      {uploadMethod === 'url' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Load
            </button>
          </div>
        </div>
      )}

      {uploadMethod === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-600">Drag & drop an image here or click to browse</p>
        </div>
      )}

      {uploadMethod === 'paste' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-gray-600">Copy an image and press Ctrl+V (or Cmd+V) to paste</p>
        </div>
      )}

      {imagePreview && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
