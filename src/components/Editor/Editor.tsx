import React, { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useFiles } from '../../contexts/FileContext';
import { useTheme } from '../../contexts/ThemeContext';
import { EditorTabs } from './EditorTabs';

export const Editor: React.FC = () => {
  const { activeFileId, getFileById, updateFileContent } = useFiles();
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const activeFile = activeFileId ? getFileById(activeFileId) : undefined;

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <EditorTabs />
      
      {activeFile ? (
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontFamily: "'Fira Code', monospace",
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
              automaticLayout: true,
            }}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
          <p>No file selected. Create or select a file to start coding.</p>
        </div>
      )}
    </div>
  );
};