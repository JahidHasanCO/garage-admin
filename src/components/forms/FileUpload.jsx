import React, { useState, useRef } from "react";

const FileUpload = ({
  label = "Upload Image",
  value,
  onChange,
  error,
  helperText,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  required = false,
}) => {
  const [preview, setPreview] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        onChange(null, `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        onChange(null, 'Please select a valid image file');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Call onChange with file and preview URL
      onChange(file, null, previewUrl);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4 w-full">
      <label className={`block text-sm font-medium mb-2 ${error ? 'text-error' : 'text-text-title'}`}>
        {label} {required && <span className="text-error">*</span>}
      </label>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area or Preview */}
      {preview ? (
        <div className="relative w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg shadow-sm"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            w-full min-h-48 flex flex-col justify-center items-center
            ${error ? 'border-error' : dragActive ? 'border-primaryDeep bg-blue-50' : 'border-gray-border hover:border-primaryDeep hover:bg-gray-50'}
          `}
        >
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Drag & drop an image here
          </h3>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border-2 border-primaryDeep text-primaryDeep bg-transparent rounded-lg hover:bg-primaryDeep hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
            Browse Files
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, GIF (Max {Math.round(maxSize / 1024 / 1024)}MB)
          </p>
        </div>
      )}

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-error' : 'text-text-gray'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;