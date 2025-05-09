import React from 'react';
import { X } from 'lucide-react';
import { useFiles } from '../../contexts/FileContext';

export const EditorTabs: React.FC = () => {
  const { files, activeFileId, setActiveFile, deleteFile } = useFiles();

  return (
    <div className="flex overflow-x-auto bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      {files.map((file) => (
        <div
          key={file.id}
          className={`
            group flex items-center min-w-0 px-3 py-2 cursor-pointer border-r border-gray-300 dark:border-gray-700
            ${activeFileId === file.id ? 
              'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400' : 
              'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
          `}
          onClick={() => setActiveFile(file.id)}
        >
          <span className="truncate max-w-[150px]">{file.name}</span>
          <button
            className="ml-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              deleteFile(file.id);
            }}
            aria-label={`Close ${file.name}`}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};