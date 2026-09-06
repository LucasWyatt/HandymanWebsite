'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  compressed?: boolean;
}

interface PhotoUploadProps {
  value?: PhotoFile[];
  onChange?: (files: PhotoFile[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  error?: string;
  helperText?: string;
  label?: string;
}

const compressImage = (file: File): Promise<File> => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      // Calculate new dimensions to maintain aspect ratio
      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = 1080;

      let { width, height } = img;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.85 // compression quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value = [],
  onChange,
  maxFiles = 6,
  maxSizePerFile = 15,
  error,
  helperText,
  label,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizePerFile * 1024 * 1024;

  const processFiles = useCallback(
    async (files: FileList) => {
      setIsProcessing(true);
      const newFiles: PhotoFile[] = [];

      for (
        let i = 0;
        i < files.length && value.length + newFiles.length < maxFiles;
        i++
      ) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
          continue;
        }

        let processedFile = file;
        let compressed = false;

        // Compress if file is too large
        if (file.size > maxSizeBytes) {
          try {
            processedFile = await compressImage(file);
            compressed = true;
          } catch (error) {
            console.error('Error compressing image:', error);
            continue;
          }
        }

        // Skip if still too large after compression
        if (processedFile.size > maxSizeBytes) {
          continue;
        }

        const preview = URL.createObjectURL(processedFile);
        const photoFile: PhotoFile = {
          id: `${Date.now()}-${i}`,
          file: processedFile,
          preview,
          compressed,
        };

        newFiles.push(photoFile);
      }

      const updatedFiles = [...value, ...newFiles];
      onChange?.(updatedFiles);
      setIsProcessing(false);
    },
    [value, maxFiles, maxSizeBytes, onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        processFiles(files);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      const updatedFiles = value.filter(file => {
        if (file.id === id) {
          URL.revokeObjectURL(file.preview);
          return false;
        }
        return true;
      });
      onChange?.(updatedFiles);
    },
    [value, onChange]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = value.length < maxFiles;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragOver
              ? 'border-brand-500 bg-brand-50'
              : 'border-neutral-300 hover:border-neutral-400',
            error && 'border-red-300 hover:border-red-400',
            isProcessing && 'pointer-events-none opacity-50'
          )}
        >
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 text-neutral-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-600">
                {isProcessing
                  ? 'Processing images...'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-neutral-500">
                Up to {maxFiles} photos, {maxSizePerFile}MB each
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {value.map(photo => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                <Image
                  src={photo.preview}
                  alt="Uploaded photo"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <button
                type="button"
                onClick={() => removeFile(photo.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="sr-only">Remove photo</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {photo.compressed && (
                <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Compressed
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status text */}
      <p className="text-sm text-neutral-500">
        {value.length} of {maxFiles} photos uploaded
      </p>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
};
