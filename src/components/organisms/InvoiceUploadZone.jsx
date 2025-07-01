import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import invoiceService from '@/services/api/invoiceService';

const InvoiceUploadZone = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingFiles, setProcessingFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Add files to processing state
    const newProcessingFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      progress: 0,
      status: 'uploading'
    }));

    setProcessingFiles(prev => [...prev, ...newProcessingFiles]);

    // Process each file
    for (const processingFile of newProcessingFiles) {
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setProcessingFiles(prev => prev.map(pf => 
            pf.id === processingFile.id 
              ? { ...pf, progress: Math.min(pf.progress + 10, 90) }
              : pf
          ));
        }, 200);

        // Create invoice record
        const invoiceData = {
          filename: processingFile.file.name,
          size: processingFile.file.size,
          type: processingFile.file.type,
          uploadDate: new Date().toISOString(),
          status: 'processing'
        };

        const createdInvoice = await invoiceService.create(invoiceData);

        clearInterval(progressInterval);

        // Complete the upload
        setProcessingFiles(prev => prev.map(pf => 
          pf.id === processingFile.id 
            ? { ...pf, progress: 100, status: 'completed' }
            : pf
        ));

        // Move to uploaded files after a brief delay
        setTimeout(() => {
          setUploadedFiles(prev => [...prev, {
            ...createdInvoice,
            file: processingFile.file
          }]);
          
          setProcessingFiles(prev => prev.filter(pf => pf.id !== processingFile.id));
          
          toast.success(`${processingFile.file.name} uploaded successfully`);
        }, 1000);

      } catch (error) {
        setProcessingFiles(prev => prev.map(pf => 
          pf.id === processingFile.id 
            ? { ...pf, status: 'error' }
            : pf
        ));
        
        toast.error(`Failed to upload ${processingFile.file.name}`);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.Id !== fileId));
    toast.info('File removed from upload queue');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return 'FileText';
    if (type.startsWith('image/')) return 'Image';
    return 'File';
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <ApperIcon
                name="Upload"
                className={`w-6 h-6 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
              />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop files here' : 'Drag & drop invoices here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or <span className="text-blue-600 font-medium">click to browse</span>
              </p>
            </div>
            
            <div className="text-xs text-gray-400">
              Supports PDF, JPG, PNG up to 10MB each
            </div>
          </div>
        </div>
      </Card>

      {/* Processing Files */}
      <AnimatePresence>
        {processingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Processing Files
              </h3>
              <div className="space-y-3">
                {processingFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <ApperIcon
                        name={getFileIcon(file.file.type)}
                        className="w-5 h-5 text-gray-400"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.file.size)}
                        </span>
                      </div>
                      
                      {file.status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <ApperIcon name="CheckCircle" className="w-4 h-4" />
                          <span className="text-xs">Upload complete</span>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <ApperIcon name="XCircle" className="w-4 h-4" />
                          <span className="text-xs">Upload failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.Id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <ApperIcon
                          name={getFileIcon(file.type)}
                          className="w-5 h-5 text-green-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-green-600">
                        <ApperIcon name="CheckCircle" className="w-4 h-4" />
                        <span className="text-xs font-medium">Ready</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceUploadZone;