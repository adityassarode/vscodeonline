import React from 'react';
import Split from 'react-split';
import { Explorer } from '../Explorer/Explorer';
import { Editor } from '../Editor/Editor';
import { Console } from '../Console/Console';
import { Toolbar } from '../Toolbar/Toolbar';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Toolbar />
      
      <Split 
        className="flex-1 flex" 
        sizes={[20, 80]} 
        minSize={150}
        gutterSize={5}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <Explorer />
        
        <div className="flex flex-col h-full">
          <Split
            className="flex-1 flex flex-col"
            sizes={[70, 30]}
            minSize={100}
            gutterSize={5}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="vertical"
            cursor="row-resize"
          >
            <Editor />
            <Console />
          </Split>
        </div>
      </Split>
      
      <footer className="p-2 text-right text-xs text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700">
        Created by Aditya Sarode
      </footer>
    </div>
  );
};