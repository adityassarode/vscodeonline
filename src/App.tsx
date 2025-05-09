import React from 'react';
import { Layout } from './components/Layout/Layout';
import { FileProvider } from './contexts/FileContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConsoleProvider } from './contexts/ConsoleContext';

function App() {
  return (
    <ThemeProvider>
      <FileProvider>
        <ConsoleProvider>
          <Layout />
        </ConsoleProvider>
      </FileProvider>
    </ThemeProvider>
  );
}

export default App;