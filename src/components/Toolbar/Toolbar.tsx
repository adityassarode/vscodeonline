import React from 'react';
import { Play, Save, Download, FilePlus, Moon, Sun } from 'lucide-react';
import { useFiles } from '../../contexts/FileContext';
import { useConsole } from '../../contexts/ConsoleContext';
import { compileAndRun } from '../../services/compiler';
import { useTheme } from '../../contexts/ThemeContext';

export const Toolbar: React.FC = () => {
  const { activeFileId, getFileById, createFile, files } = useFiles();
  const { addOutput, clearOutputs } = useConsole();
  const { theme, toggleTheme } = useTheme();

  const handleRun = async () => {
    if (!activeFileId) {
      addOutput('stderr', 'No file selected. Please select a file to run.');
      return;
    }

    const file = getFileById(activeFileId);
    if (!file) {
      addOutput('stderr', 'File not found.');
      return;
    }

    if (!file.name.endsWith('.cpp')) {
      addOutput('stderr', 'Only C++ files can be compiled and run.');
      return;
    }

    clearOutputs();
    addOutput('stdout', `Compiling and running ${file.name}...`);

    try {
      const result = await compileAndRun(file.content);
      
      if (result.stderr) {
        addOutput('stderr', result.stderr);
      }
      
      if (result.stdout) {
        addOutput('stdout', result.stdout);
      }
      
      addOutput('stdout', `Program exited with code ${result.exitCode}`);
    } catch (error) {
      addOutput('stderr', `Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleNewFile = () => {
    createFile(`newfile${files.length + 1}.cpp`);
  };

  const handleSave = () => {
    addOutput('stdout', 'All files are automatically saved in local storage.');
  };

  const handleDownload = () => {
    if (!activeFileId) {
      addOutput('stderr', 'No file selected. Please select a file to download.');
      return;
    }

    const file = getFileById(activeFileId);
    if (!file) {
      addOutput('stderr', 'File not found.');
      return;
    }

    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addOutput('stdout', `Downloaded ${file.name}`);
  };

  return (
    <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleNewFile}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="New File"
        >
          <FilePlus size={18} />
        </button>
        <button
          onClick={handleSave}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Save"
        >
          <Save size={18} />
        </button>
        <button
          onClick={handleRun}
          className="p-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white"
          title="Run"
        >
          <Play size={18} />
        </button>
        <button
          onClick={handleDownload}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Download File"
        >
          <Download size={18} />
        </button>
      </div>
      
      <div className="flex-1"></div>
      
      <button
        onClick={toggleTheme}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  );
};