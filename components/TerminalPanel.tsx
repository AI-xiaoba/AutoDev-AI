import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon, XCircle, CheckCircle, AlertTriangle } from './Icons';

interface TerminalPanelProps {
  logs: LogEntry[];
  isOpen: boolean;
  toggleOpen: () => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ logs, isOpen, toggleOpen }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  const getLogIcon = (type: LogEntry['type']) => {
     switch (type) {
      case 'error': return <XCircle className="w-3 h-3 mt-1 mr-2 text-red-500" />;
      case 'success': return <CheckCircle className="w-3 h-3 mt-1 mr-2 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 mt-1 mr-2 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className={`border-t border-gray-800 bg-gray-950 flex flex-col transition-all duration-300 ${isOpen ? 'h-64' : 'h-10'}`}>
      <div 
        className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 cursor-pointer hover:bg-gray-800"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Terminal & Agent Logs</span>
          <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-500">{logs.length} events</span>
        </div>
        <div className="text-xs text-gray-500">
          {isOpen ? 'Click to collapse' : 'Click to expand'}
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start opacity-0 animate-fadeIn" style={{animation: 'fadeIn 0.2s forwards'}}>
              <span className="text-gray-600 mr-3 min-w-[70px]">{log.timestamp.toLocaleTimeString().split(' ')[0]}</span>
              <span className={`uppercase font-bold mr-3 min-w-[60px] ${log.source === 'SYSTEM' ? 'text-blue-500' : log.source === 'TEST' ? 'text-purple-500' : 'text-orange-500'}`}>
                [{log.source}]
              </span>
              <div className="flex items-start flex-1">
                 {getLogIcon(log.type)}
                 <span className={`${getLogColor(log.type)} whitespace-pre-wrap break-all`}>{log.message}</span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TerminalPanel;