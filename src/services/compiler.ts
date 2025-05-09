import { CompileResponse } from '../types';

declare const Emscripten: any;

let compilerInitialized = false;
let Module: any = null;

async function initializeCompiler() {
  if (compilerInitialized) return;
  
  // Load Emscripten-generated JavaScript
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/cppjs-wasm@0.0.2/dist/cpp.js';
  document.body.appendChild(script);
  
  await new Promise((resolve) => {
    script.onload = resolve;
  });
  
  // Initialize the module
  Module = await Emscripten();
  compilerInitialized = true;
}

export const compileAndRun = async (code: string): Promise<CompileResponse> => {
  try {
    await initializeCompiler();
    
    // Create a virtual file system for the code
    const filename = 'program.cpp';
    Module.FS.writeFile(filename, code);
    
    // Compile the code
    const compileResult = Module.ccall(
      'compileCode',
      'number',
      ['string'],
      [filename]
    );
    
    if (compileResult !== 0) {
      const error = Module.getCompileError();
      return {
        stdout: '',
        stderr: error,
        exitCode: 1
      };
    }
    
    // Run the compiled program
    const result = Module.ccall(
      'runProgram',
      'string',
      [],
      []
    );
    
    // Clean up
    Module.FS.unlink(filename);
    
    // Parse the output
    const output = JSON.parse(result);
    
    return {
      stdout: output.stdout || '',
      stderr: output.stderr || '',
      exitCode: output.exitCode || 0
    };
  } catch (error) {
    console.error('Error compiling code:', error);
    return {
      stdout: '',
      stderr: 'Error compiling code: ' + (error instanceof Error ? error.message : String(error)),
      exitCode: 1
    };
  }
};