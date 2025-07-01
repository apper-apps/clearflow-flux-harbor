import React from 'react';
import InvoiceUploadZone from '@/components/organisms/InvoiceUploadZone';

const Invoices = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Upload Invoices
          </h2>
          <p className="text-gray-600">
            Drag and drop your invoice files here or click to browse. Supported formats: PDF, JPG, PNG.
          </p>
        </div>
        
        <InvoiceUploadZone />
      </div>
    </div>
  );
};

export default Invoices;