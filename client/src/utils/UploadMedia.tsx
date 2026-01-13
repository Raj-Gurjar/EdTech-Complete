import React, { useEffect, useState, useRef } from "react";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import toast from "react-hot-toast";
import { FaUpload, FaTimes, FaImage, FaVideo, FaFile, FaCheckCircle } from "react-icons/fa";

interface UploadMediaProps {
  name: string;
  label: string;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  video?: boolean;
  image?: boolean;
  previewMedia?: string;
}

interface MediaState {
  file: File | string;
  preview: string;
}

// File size limits in bytes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images/thumbnails
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB for videos

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export default function UploadMedia({
  name,
  label,
  setValue,
  register,
  errors,
  video,
  image,
  previewMedia,
}: UploadMediaProps) {
  const [media, setMedia] = useState<MediaState>({
    file: "",
    preview: previewMedia || "",
  });
  const [fileError, setFileError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    register(name);
    setValue(name, media.file);
  }, [register, name, setValue, media.file]);

  useEffect(() => {
    if (previewMedia) {
      setMedia((prev) => ({ ...prev, preview: previewMedia }));
    }
  }, [previewMedia]);

  const validateFile = (file: File): boolean => {
    setFileError("");
    
    // Check file size
    const maxSize = image ? MAX_IMAGE_SIZE : video ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const maxSizeFormatted = formatFileSize(maxSize);
      const fileSizeFormatted = formatFileSize(file.size);
      const errorMessage = `${label} size (${fileSizeFormatted}) exceeds the maximum allowed size of ${maxSizeFormatted}`;
      setFileError(errorMessage);
      toast.error(errorMessage);
      return false;
    }

    // Check file type
    if (image && !file.type.startsWith("image/")) {
      const errorMessage = "Please select a valid image file";
      setFileError(errorMessage);
      toast.error(errorMessage);
      return false;
    }

    if (video && !file.type.startsWith("video/")) {
      const errorMessage = "Please select a valid video file";
      setFileError(errorMessage);
      toast.error(errorMessage);
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File) => {
    if (validateFile(file)) {
      setUploadProgress(0);
      const reader = new FileReader();
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 50);

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setMedia({ file: file, preview: reader.result as string });
        setValue(name, file);
        setFileError("");
        setTimeout(() => setUploadProgress(0), 1000);
      };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      handleFileChange(uploadedFile);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setMedia({ file: "", preview: previewMedia || "" });
    setValue(name, "");
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const maxSizeFormatted = image 
    ? formatFileSize(MAX_IMAGE_SIZE) 
    : video 
    ? formatFileSize(MAX_VIDEO_SIZE) 
    : formatFileSize(MAX_IMAGE_SIZE);

  const fileSize = media.file instanceof File ? formatFileSize(media.file.size) : "";
  const fileName = media.file instanceof File ? media.file.name : "";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label} <span className="text-red2">*</span>
      </label>
      
      {media.preview ? (
        <div className="space-y-3">
          {/* Preview Section */}
          <div className="relative group">
            <div className="relative border-2 border-black5 rounded-xl overflow-hidden bg-black3">
              {video ? (
                <video
                  src={media.preview}
                  controls
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              ) : (
                <img
                  src={media.preview}
                  alt={label}
                  className="w-full h-auto max-h-[300px] object-cover"
                />
              )}
              {/* Overlay with remove button - Only for images */}
              {image && (
                <div className="absolute inset-0 bg-black1/0 group-hover:bg-black1/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-red2 hover:bg-red1 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:scale-110"
                    aria-label="Remove media"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
              )}
            </div>
            
            {/* File Info */}
            {media.file instanceof File && (
              <div className="bg-black4 border border-black5 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {image ? (
                    <FaImage className="text-purple6 text-xl flex-shrink-0" />
                  ) : video ? (
                    <FaVideo className="text-purple6 text-xl flex-shrink-0" />
                  ) : (
                    <FaFile className="text-purple6 text-xl flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{fileName}</p>
                    <p className="text-white4 text-xs">{fileSize}</p>
                  </div>
                  <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                </div>
              </div>
            )}
          </div>

          {/* Change File Button */}
          <button
            type="button"
            onClick={handleClick}
            className="w-full bg-black4 hover:bg-black3 border border-black5 hover:border-purple6 text-white py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <FaUpload className="text-xs" />
            Change {label}
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-purple6 bg-purple6/10 scale-[1.02]"
              : "border-black5 hover:border-purple6 bg-black3 hover:bg-black4"
          } ${errors[name] || fileError ? "border-red2" : ""}`}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Icon */}
            <div className={`p-4 rounded-full transition-all duration-200 ${
              isDragging 
                ? "bg-purple6/20 scale-110" 
                : "bg-black4"
            }`}>
              {image ? (
                <FaImage className={`text-4xl ${isDragging ? "text-purple6" : "text-purple6"}`} />
              ) : video ? (
                <FaVideo className={`text-4xl ${isDragging ? "text-purple6" : "text-purple6"}`} />
              ) : (
                <FaUpload className={`text-4xl ${isDragging ? "text-purple6" : "text-purple6"}`} />
              )}
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <p className="text-white font-semibold text-base sm:text-lg">
                {isDragging ? "Drop your file here" : `Click to upload or drag and drop`}
              </p>
              <p className="text-white4 text-sm">
                {image 
                  ? `PNG, JPG, GIF up to ${maxSizeFormatted}` 
                  : video 
                  ? `MP4, MOV, AVI up to ${maxSizeFormatted}`
                  : `Select a file up to ${maxSizeFormatted}`}
              </p>
            </div>

            {/* Upload Button */}
            <button
              type="button"
              className="mt-2 bg-purple6 hover:bg-purple5 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleInputChange}
        accept={image ? "image/*" : video ? "video/*" : ""}
        className="hidden"
      />

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-black5 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple6 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error Messages */}
      {fileError && (
        <div className="bg-red2/10 border border-red2 rounded-lg p-3">
          <p className="text-red2 text-sm flex items-center gap-2">
            <FaTimes className="text-xs" />
            {fileError}
          </p>
        </div>
      )}
      {errors[name] && !fileError && (
        <p className="text-red2 text-sm mt-1 flex items-center gap-2">
          <FaTimes className="text-xs" />
          {label} is required
        </p>
      )}
    </div>
  );
}
