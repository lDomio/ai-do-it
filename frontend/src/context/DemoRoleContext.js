import React, { createContext, useContext, useState, useCallback } from 'react';
import { DemoRole } from '../domain/DemoRole.js';

const DemoRoleContext = createContext(null);

export function DemoRoleProvider({ children, initialRole = 'cliente' }) {
  const [role, setRoleState] = useState(() => new DemoRole(initialRole));

  const setRole = useCallback((nextRole) => {
    setRoleState((current) => {
      if (current.is(nextRole)) {
        return current;
      }
      return new DemoRole(nextRole);
    });
  }, []);

  const value = {
    role: role.role,
    isClient: role.is('cliente'),
    isFreelancer: role.is('freelancer'),
    setRole,
  };

  return <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>;
}

export function useDemoRole() {
  const context = useContext(DemoRoleContext);
  if (context === null) {
    throw new Error('useDemoRole must be used within a DemoRoleProvider');
  }
  return context;
}
