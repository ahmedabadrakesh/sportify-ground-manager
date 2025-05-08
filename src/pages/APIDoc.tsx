
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import APIDocumentation from '@/components/swagger/SwaggerUI';

const APIDoc = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <APIDocumentation />
      </div>
    </MainLayout>
  );
};

export default APIDoc;
