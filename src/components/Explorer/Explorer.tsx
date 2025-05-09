import React, { useState } from 'react';
import { FileText, FolderPlus, File, Trash2, Edit2 } from 'lucide-react';
import { useFiles } from '../../contexts/FileContext';

export const Explorer: React.FC = () => {
  const { files, activeFileId, setActiveFile, createFile, deleteFile, renameFile } = useFiles();
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState('');

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      // Add .cpp extension if not present
      const fileName = newFileName.endsWith('.cpp') ? newFileName : `${newFileName}.cpp`;
      createFile(fileName);
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFile();
    } else if (e.key === 'Escape') {
      setIsCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleStartRename = (id: string, name: string) => {
    setEditingFileId(id);
    setEditingFileName(name);
  };

  const handleRename = () => {
    if (editingFileId && editingFileName.trim()) {
      // Add .cpp extension if not present
      const fileName = editingFileName.endsWith('.cpp') ? editingFileName : `${editingFileName}.cpp`;
      renameFile(editingFileId, fileName);
      setEditingFileId(null);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingFileId(null);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 h-full flex flex-col p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">EXPLORER</h2>
        <button
          onClick={() => setIsCreatingFile(true)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Create new file"
        >
          <FolderPlus size={16} />
        </button>
      </div>
      
      {isCreatingFile && (
        <div className="mx-2 mb-2">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCreateFile}
            autoFocus
            placeholder="filename.cpp"
            className="w-full p-1 text-xs border border-blue-500 rounded focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className={`
              flex items-center justify-between p-2 text-sm cursor-pointer rounded
              ${activeFileId === file.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}
            `}
            onClick={() => setActiveFile(file.id)}
          >
            <div className="flex items-center overflow-hidden">
              {editingFileId === file.id ? (
                <input
                  type="text"
                  value={editingFileName}
                  onChange={(e) => setEditingFileName(e.target.value)}
                  onKeyDown={handleRenameKeyDown}
                  onBlur={handleRename}
                  autoFocus
                  className="w-full p-1 text-xs border border-blue-500 rounded focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <>
                  <FileText size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="truncate dark:text-gray-300">{file.name}</span>
                </>
              )}
            </div>
            
            {!editingFileId && (
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartRename(file.id, file.name);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Rename file"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  aria-label="Delete file"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};