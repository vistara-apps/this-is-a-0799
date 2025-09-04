import React, { useRef, useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { Card } from './Card';

export const ImageUploader = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-purple-400 bg-purple-400/10' 
            : 'border-white/30 hover:border-white/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white/60" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Upload Product Image</h3>
            <p className="text-white/60 text-sm mb-4">
              Drag and drop your image here, or click to browse
            </p>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
          >
            Choose File
          </button>
          
          <div className="flex items-center justify-center space-x-2 text-white/40 text-xs">
            <Image className="w-4 h-4" />
            <span>PNG, JPG up to 10MB</span>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
        />
      </div>
    </Card>
  );
};