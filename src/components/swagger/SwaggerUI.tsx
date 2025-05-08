
import React, { useEffect, useRef } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { swaggerDefinition } from './SwaggerDefinition';

const APIDocumentation = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
        <p className="mb-6">
          This documentation provides details about the available API endpoints for the Sports Platform.
          All endpoints below are publicly accessible without authentication.
        </p>
        <div className="border rounded-lg">
          <SwaggerUI spec={swaggerDefinition} />
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
