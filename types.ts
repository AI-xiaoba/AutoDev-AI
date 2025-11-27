export enum AgentStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  CODING = 'CODING',
  TESTING = 'TESTING',
  REPAIRING = 'REPAIRING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum StepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED'
}

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  agent: 'PLANNER' | 'CODER' | 'TESTER';
  files?: string[];
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

export interface DiffLine {
  type: 'unchanged' | 'added' | 'removed';
  content: string;
  lineNumber: number;
}

export interface FileDiff {
  filePath: string;
  original: string;
  modified: string;
  status: 'modified' | 'created' | 'deleted';
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  source: 'SYSTEM' | 'TEST' | 'BUILD' | 'AGENT';
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
