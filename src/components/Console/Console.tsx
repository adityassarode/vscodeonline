import React, { useRef, useEffect } from 'react';
import { Trash } from 'lucide-react';
import { useConsole } from '../../contexts/ConsoleContext';

export const Console: React.FC = () => {
  const { outputs, clearOutputs } = useConsole();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputs]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">CONSOLE</h3>
        <button
          onClick={clearOutputs}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Clear console"
        >
          <Trash size={16} />
        </button>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto bg-white dark:bg-gray-900 font-mono text-sm">
        {outputs.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 italic p-2">
            Console is empty. Run your code to see output here.
          </div>
        ) : (
          outputs.map((output, index) => (
            <div
              key={index}
              className={`px-2 py-1 whitespace-pre-wrap ${
                output.type === 'stderr'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-gray-300'
              }`}
            >
              {output.content}
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};