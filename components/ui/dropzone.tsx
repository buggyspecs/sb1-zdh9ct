'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { MAX_FILES, MAX_FILE_SIZE_MB } from '@/lib/constants';

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  className?: string;
  accept?: string;
  text?: string;
  disabled?: boolean;
}

export function Dropzone({
  onFilesDrop,
  className,
  accept,
  text,
  disabled,
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > MAX_FILES) {
        alert(`You can only upload up to ${MAX_FILES} files at once.`);
        return;
      }
      onFilesDrop(acceptedFiles);
    },
    accept: accept ? { [accept.replace('.', 'image/')]: [accept] } : undefined,
    disabled,
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024, // Convert MB to bytes
    onDropRejected: (fileRejections) => {
      const errors = fileRejections.map(rejection => {
        if (rejection.errors[0].code === 'file-too-large') {
          return `${rejection.file.name} is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
        }
        return `${rejection.file.name}: ${rejection.errors[0].message}`;
      });
      alert(errors.join('\n'));
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-border',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{text}</p>
        <p className="text-xs text-muted-foreground">
          Maximum {MAX_FILES} files, up to {MAX_FILE_SIZE_MB}MB each
        </p>
      </div>
    </div>
  );
}