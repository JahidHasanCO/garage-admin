import React, { useState, useRef } from "react";
import { PhotoIcon, ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
      if (file.size > maxSize) {
        onChange(null, `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        onChange(null, 'Please select a valid image file');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
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
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4 w-full">
      <label className={`block text-sm font-medium mb-2 ${error ? 'text-red-600' : 'text-gray-800'}`}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg shadow-sm border border-gray-300"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70 transition-all"
          >
            <XMarkIcon className="w-4 h-4" />
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
            ${error ? 'border-red-600' : dragActive ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          `}
        >
          <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Drag & drop an image here</h3>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border-2 border-gray-400 text-gray-700 bg-transparent rounded-lg hover:bg-gray-400 hover:text-white transition-all duration-200"
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            Browse Files
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, GIF (Max {Math.round(maxSize / 1024 / 1024)}MB)
          </p>
        </div>
      )}

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
