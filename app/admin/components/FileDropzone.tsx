// app/components/FileDropzone.tsx

import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFileUpload: (file: File) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileUpload }) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag 'n' drop a file here, or click to select a file</p>
    </div>
  );
};

export default FileDropzone;
