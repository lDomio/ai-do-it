import React, { createContext, useContext, useState } from 'react';
import { ApiConfig } from '../domain/ApiConfig.js';

const ApiConfigContext = createContext(null);

export function ApiConfigProvider({
  children,
  baseUrl = 'http://localhost:3000',
  timeoutMs = 5000,
}) {
  const [config] = useState(() => {
    try {
      return new ApiConfig(baseUrl, timeoutMs);
    } catch (error) {
      console.error('ApiConfigProvider: invalid configuration', error.message);
      return new ApiConfig('http://localhost:3000', 5000);
    }
  });

  return <ApiConfigContext.Provider value={config}>{children}</ApiConfigContext.Provider>;
}

export function useApiConfig() {
  const context = useContext(ApiConfigContext);
  if (context === null) {
    throw new Error('useApiConfig must be used within an ApiConfigProvider');
  }
  return context;
}
