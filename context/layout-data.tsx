'use client';

import { createContext, useContext } from 'react';

import { LayoutQueryResponse } from '@/types';

type LayoutDataContextType = LayoutQueryResponse;

const LayoutDataContext = createContext<LayoutDataContextType | undefined>(
  undefined
);

export const useLayoutData = () => {
  const context = useContext(LayoutDataContext);
  if (!context)
    throw new Error('useLayout must be used within a LayoutProvider');
  return context;
};

export const LayoutDataProvider = ({
  children,
  value
}: {
  children: React.ReactNode;
  value: LayoutDataContextType;
}) => (
  <LayoutDataContext.Provider value={value}>
    {children}
  </LayoutDataContext.Provider>
);
