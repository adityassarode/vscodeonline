import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileData } from '../types';

interface FileContextValue {
  files: FileData[];
  activeFileId: string | null;
  createFile: (name: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  getFileById: (id: string) => FileData | undefined;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

const DEFAULT_CPP_CONTENT = `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileData[]>(() => {
    const savedFiles = localStorage.getItem('files');
    if (savedFiles) {
      return JSON.parse(savedFiles);
    }
    // Default file
    return [
      {
        id: uuidv4(),
        name: 'main.cpp',
        content: DEFAULT_CPP_CONTENT,
        language: 'cpp'
      }
    ];
  });

  const [activeFileId, setActiveFileId] = useState<string | null>(() => {
    const savedActiveFileId = localStorage.getItem('activeFileId');
    if (savedActiveFileId) {
      return savedActiveFileId;
    }
    // Default to the first file
    return files[0]?.id || null;
  });

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  // Save activeFileId to localStorage whenever it changes
  useEffect(() => {
    if (activeFileId) {
      localStorage.setItem('activeFileId', activeFileId);
    }
  }, [activeFileId]);

  const createFile = (name: string) => {
    const newFile: FileData = {
      id: uuidv4(),
      name,
      content: name.endsWith('.cpp') ? DEFAULT_CPP_CONTENT : '',
      language: name.endsWith('.cpp') ? 'cpp' : 'plaintext'
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const deleteFile = (id: string) => {
    const newFiles = files.filter(file => file.id !== id);
    setFiles(newFiles);
    
    if (activeFileId === id && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
    } else if (newFiles.length === 0) {
      setActiveFileId(null);
    }
  };

  const renameFile = (id: string, newName: string) => {
    setFiles(
      files.map(file => {
        if (file.id === id) {
          return {
            ...file,
            name: newName,
            language: newName.endsWith('.cpp') ? 'cpp' : 'plaintext'
          };
        }
        return file;
      })
    );
  };

  const updateFileContent = (id: string, content: string) => {
    setFiles(
      files.map(file => {
        if (file.id === id) {
          return { ...file, content };
        }
        return file;
      })
    );
  };

  const getFileById = (id: string) => {
    return files.find(file => file.id === id);
  };

  return (
    <FileContext.Provider
      value={{
        files,
        activeFileId,
        createFile,
        deleteFile,
        renameFile,
        setActiveFile: setActiveFileId,
        updateFileContent,
        getFileById
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};