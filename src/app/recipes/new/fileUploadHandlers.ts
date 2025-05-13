import { useState } from 'react';

export const useFileUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 5MB.');
        return;
      }
      
      setUploadedImage(file);
      setError('');
    }
  };

  const handleFileUpload = async (): Promise<string> => {
    if (!uploadedImage) {
      setError('No file selected');
      return '';
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedImage);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      setImageUrl(data.url);
      setUploadProgress(100);
      
      // Reset after successful upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
      
      return data.url;
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
      console.error('Error uploading image:', err);
      setIsUploading(false);
      setUploadProgress(0);
      return '';
    }
  };

  return {
    uploadedImage,
    uploadProgress,
    isUploading,
    imageUrl,
    error,
    handleFileChange,
    handleFileUpload,
    setUploadedImage,
    setImageUrl,
    setError,
  };
};
