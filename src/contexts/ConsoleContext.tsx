import React, { createContext, useContext, useState } from 'react';
import { ConsoleOutput } from '../types';

interface ConsoleContextValue {
  outputs: ConsoleOutput[];
  addOutput: (type: 'stdout' | 'stderr', content: string) => void;
  clearOutputs: () => void;
}

const ConsoleContext = createContext<ConsoleContextValue | undefined>(undefined);

export const ConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);

  const addOutput = (type: 'stdout' | 'stderr', content: string) => {
    const newOutput: ConsoleOutput = {
      type,
      content,
      timestamp: Date.now()
    };
    setOutputs(prevOutputs => [...prevOutputs, newOutput]);
  };

  const clearOutputs = () => {
    setOutputs([]);
  };

  return (
    <ConsoleContext.Provider value={{ outputs, addOutput, clearOutputs }}>
      {children}
    </ConsoleContext.Provider>
  );
};

export const useConsole = () => {
  const context = useContext(ConsoleContext);
  if (!context) {
    throw new Error('useConsole must be used within a ConsoleProvider');
  }
  return context;
};