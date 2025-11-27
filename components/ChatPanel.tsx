import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AgentStatus } from '../types';
import { MessageSquare, Play, Loader2 } from './Icons';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  agentStatus: AgentStatus;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, agentStatus }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || agentStatus !== AgentStatus.IDLE) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 w-80 md:w-96">
      <div className="p-4 border-b border-gray-800 bg-gray-850">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Orchestrator Agent
        </h2>
        <p className="text-xs text-gray-500 mt-1">Autonomous development assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[90%] rounded-lg p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-200 border border-gray-700'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            <span className="text-[10px] text-gray-600 mt-1">
              {msg.role === 'user' ? 'You' : 'AutoDev AI'} • {msg.timestamp.toLocaleTimeString().slice(0, 5)}
            </span>
          </div>
        ))}
        {agentStatus !== AgentStatus.IDLE && agentStatus !== AgentStatus.COMPLETED && (
             <div className="flex items-start">
                 <div className="bg-gray-800 text-gray-400 rounded-lg p-3 text-xs border border-gray-700 flex items-center gap-2">
                     <Loader2 className="w-3 h-3 animate-spin" />
                     Thinking...
                 </div>
             </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={agentStatus !== AgentStatus.IDLE}
            placeholder={agentStatus === AgentStatus.IDLE ? "Describe a task (e.g., 'Add User Roles')..." : "Agent is working..."}
            className="w-full bg-gray-950 border border-gray-700 rounded-md py-3 pl-4 pr-10 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            type="submit"
            disabled={!input.trim() || agentStatus !== AgentStatus.IDLE}
            className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-indigo-400 disabled:text-gray-600 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
        <p className="text-[10px] text-gray-600 mt-2 text-center">
            AI can modify files and run tests autonomously.
        </p>
      </form>
    </div>
  );
};

export default ChatPanel;