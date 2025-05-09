export interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
}

export interface ConsoleOutput {
  type: 'stdout' | 'stderr';
  content: string;
  timestamp: number;
}

export interface CompileResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
}