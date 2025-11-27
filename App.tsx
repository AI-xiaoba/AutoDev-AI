import React, { useState, useEffect } from 'react';
import { 
  AgentStatus, 
  StepStatus, 
  PlanStep, 
  FileDiff, 
  LogEntry, 
  ChatMessage 
} from './types';
import { INITIAL_FILE_TREE, MOCK_DIFF_CONTROLLER, MOCK_DIFF_SERVICE } from './constants';

import FileExplorer from './components/FileExplorer';
import PlanWidget from './components/PlanWidget';
import DiffViewer from './components/DiffViewer';
import ChatPanel from './components/ChatPanel';
import TerminalPanel from './components/TerminalPanel';
import { Settings, Cpu } from './components/Icons';

function App() {
  // State
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1', role: 'ai', content: 'Hello! I am ready to help you develop. What feature should we implement today?', timestamp: new Date()
  }]);
  const [steps, setSteps] = useState<PlanStep[]>([]);
  const [files] = useState(INITIAL_FILE_TREE);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [currentDiff, setCurrentDiff] = useState<FileDiff | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  // Helper to add logs
  const addLog = (source: LogEntry['source'], message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date(),
      source,
      message,
      type
    }]);
  };

  // Helper to update specific step
  const updateStep = (id: string, updates: Partial<PlanStep>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // The "Brain" - Simulation Logic
  const handleUserMessage = (text: string) => {
    // 1. User Input
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setStatus(AgentStatus.PLANNING);
    
    addLog('SYSTEM', 'Received new task: ' + text, 'info');

    // 2. Planning Phase
    setTimeout(() => {
        const newSteps: PlanStep[] = [
            { id: 's1', title: 'Analyze DB Schema', description: 'Check existing user entity relation', status: StepStatus.PENDING, agent: 'PLANNER', files: ['src/models/user.entity.ts'] },
            { id: 's2', title: 'Create Role Entity', description: 'Define Role model and relations', status: StepStatus.PENDING, agent: 'CODER', files: ['src/models/role.entity.ts'] },
            { id: 's3', title: 'Update User Service', description: 'Add createRole method', status: StepStatus.PENDING, agent: 'CODER', files: ['src/services/user.service.ts'] },
            { id: 's4', title: 'Add Controller Endpoints', description: 'POST /roles endpoint', status: StepStatus.PENDING, agent: 'CODER', files: ['src/controllers/user.controller.ts'] },
            { id: 's5', title: 'Verify & Test', description: 'Run integration tests', status: StepStatus.PENDING, agent: 'TESTER' },
        ];
        setSteps(newSteps);
        addLog('AGENT', 'Plan generated with 5 steps', 'success');
        
        // Start Execution Loop
        executePlan(newSteps);
    }, 2000);
  };

  const executePlan = async (currentSteps: PlanStep[]) => {
      // Step 1: Analyze (Instant)
      updateStep('s1', { status: StepStatus.IN_PROGRESS });
      await new Promise(r => setTimeout(r, 1000));
      updateStep('s1', { status: StepStatus.SUCCESS });
      addLog('AGENT', 'Analysis complete. Database schema compatible.', 'success');

      // Step 2: Create Entity (Instant for demo)
      updateStep('s2', { status: StepStatus.IN_PROGRESS });
      setStatus(AgentStatus.CODING);
      await new Promise(r => setTimeout(r, 1500));
      updateStep('s2', { status: StepStatus.SUCCESS });
      addLog('AGENT', 'Created src/models/role.entity.ts', 'success');

      // Step 3: Service (Show Diff)
      updateStep('s3', { status: StepStatus.IN_PROGRESS });
      addLog('AGENT', 'Modifying src/services/user.service.ts...', 'info');
      await new Promise(r => setTimeout(r, 2000));
      
      // TRIGGER UI UPDATE
      setActiveFile('src/services/user.service.ts');
      setCurrentDiff(MOCK_DIFF_SERVICE);
      updateStep('s3', { status: StepStatus.SUCCESS });

      // Step 4: Controller (Show Diff)
      updateStep('s4', { status: StepStatus.IN_PROGRESS });
      addLog('AGENT', 'Modifying src/controllers/user.controller.ts...', 'info');
      await new Promise(r => setTimeout(r, 2000));
      
      // TRIGGER UI UPDATE
      setActiveFile('src/controllers/user.controller.ts');
      setCurrentDiff(MOCK_DIFF_CONTROLLER);
      updateStep('s4', { status: StepStatus.SUCCESS });

      // Step 5: Testing (Simulate Failure & Repair)
      setStatus(AgentStatus.TESTING);
      updateStep('s5', { status: StepStatus.IN_PROGRESS });
      addLog('SYSTEM', 'Running: npm test -- src/controllers/user.controller.spec.ts', 'info');
      
      await new Promise(r => setTimeout(r, 2000));
      
      // FAIL
      addLog('TEST', 'FAIL: User Controller > should create role', 'error');
      addLog('TEST', 'Error: AdminGuard not found in imports', 'error');
      
      // REPAIR
      setStatus(AgentStatus.REPAIRING);
      updateStep('s5', { status: StepStatus.FAILED });
      addLog('AGENT', 'Detected missing import "AdminGuard". Self-repairing...', 'warning');
      
      await new Promise(r => setTimeout(r, 2500));
      
      // RE-TEST
      setStatus(AgentStatus.TESTING);
      addLog('SYSTEM', 'Re-running tests...', 'info');
      await new Promise(r => setTimeout(r, 1500));
      
      addLog('TEST', 'PASS: User Controller > should create role', 'success');
      updateStep('s5', { status: StepStatus.SUCCESS });
      
      // FINISH
      setStatus(AgentStatus.COMPLETED);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          content: 'Task completed! I added the Role entity, updated the service, and exposed the API endpoint. Tests are passing after fixing a missing import.',
          timestamp: new Date()
      }]);
  };

  const handleFileSelect = (path: string) => {
      setActiveFile(path);
      // specific logic to toggle mock diffs based on file selection for demo
      if (path.includes('controller')) setCurrentDiff(MOCK_DIFF_CONTROLLER);
      else if (path.includes('service')) setCurrentDiff(MOCK_DIFF_SERVICE);
      else setCurrentDiff(null);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-950 text-gray-200 font-sans">
      {/* Top Bar */}
      <header className="h-12 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
            <Cpu className="text-white w-4 h-4" />
          </div>
          <h1 className="font-semibold text-gray-100 tracking-tight">AutoDev AI <span className="text-xs text-gray-500 font-normal ml-2">v0.1.0 MVP</span></h1>
        </div>
        <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${
                status === AgentStatus.IDLE ? 'border-gray-700 text-gray-500' :
                status === AgentStatus.FAILED ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                status === AgentStatus.COMPLETED ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 animate-pulse'
            }`}>
                <div className={`w-2 h-2 rounded-full ${
                    status === AgentStatus.IDLE ? 'bg-gray-500' :
                    status === AgentStatus.FAILED ? 'bg-red-500' :
                    status === AgentStatus.COMPLETED ? 'bg-green-500' :
                    'bg-indigo-500'
                }`} />
                {status}
            </div>
            <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-300" />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Sidebar (Files + Plan) */}
        <div className="w-64 flex flex-col shrink-0">
            <div className="h-1/2 overflow-hidden">
                <FileExplorer files={files} onSelectFile={handleFileSelect} selectedFile={activeFile} />
            </div>
            <div className="h-1/2 border-t border-gray-800 overflow-hidden">
                <PlanWidget steps={steps} status={status} />
            </div>
        </div>

        {/* Middle: Code/Diff View */}
        <div className="flex-1 flex flex-col min-w-0 bg-editor-bg">
            {/* Tabs */}
            <div className="flex h-9 bg-editor-sidebar border-b border-gray-800">
                 {activeFile && (
                     <div className="px-4 py-2 text-xs text-gray-200 bg-editor-bg border-r border-gray-800 border-t-2 border-t-indigo-500 flex items-center gap-2">
                         <span className="opacity-80">TS</span>
                         {activeFile.split('/').pop()}
                     </div>
                 )}
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                <DiffViewer diff={currentDiff} />
            </div>

            {/* Bottom: Terminal */}
            <TerminalPanel logs={logs} isOpen={isTerminalOpen} toggleOpen={() => setIsTerminalOpen(!isTerminalOpen)} />
        </div>

        {/* Right: Chat Panel */}
        <ChatPanel 
            messages={messages} 
            onSendMessage={handleUserMessage} 
            agentStatus={status}
        />
      </div>
    </div>
  );
}

export default App;