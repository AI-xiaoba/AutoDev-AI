import React from 'react';
import { PlanStep, StepStatus, AgentStatus } from '../types';
import { CheckCircle, Loader2, XCircle, Cpu, Shield, RefreshCw } from './Icons';

interface PlanWidgetProps {
  steps: PlanStep[];
  status: AgentStatus;
}

const PlanWidget: React.FC<PlanWidgetProps> = ({ steps, status }) => {
  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
        <Cpu className="w-12 h-12 opacity-20" />
        <p>No active plan. Describe a task to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          Execution Plan
        </h2>
        {status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETED && (
            <span className="text-xs flex items-center gap-1 text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-full animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                {status}
            </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`relative pl-8 pb-4 border-l-2 last:border-0 ${
              step.status === StepStatus.SUCCESS ? 'border-green-500/20' : 
              step.status === StepStatus.IN_PROGRESS ? 'border-indigo-500/50' : 
              step.status === StepStatus.FAILED ? 'border-red-500/50' : 'border-gray-700'
            }`}
          >
            {/* Timeline Node */}
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-gray-900 ${
               step.status === StepStatus.SUCCESS ? 'border-green-500 text-green-500' : 
               step.status === StepStatus.IN_PROGRESS ? 'border-indigo-500 text-indigo-500' : 
               step.status === StepStatus.FAILED ? 'border-red-500 text-red-500' : 'border-gray-600'
            }`}>
              {step.status === StepStatus.SUCCESS && <CheckCircle className="w-3 h-3" />}
              {step.status === StepStatus.IN_PROGRESS && <Loader2 className="w-3 h-3 animate-spin" />}
              {step.status === StepStatus.FAILED && <XCircle className="w-3 h-3" />}
              {step.status === StepStatus.PENDING && <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />}
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-sm font-medium ${
                    step.status === StepStatus.IN_PROGRESS ? 'text-indigo-300' : 
                    step.status === StepStatus.SUCCESS ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                    {step.agent}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{step.description}</p>
              
              {step.files && step.files.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {step.files.map(f => (
                        <span key={f} className="text-[10px] bg-gray-900 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
                            {f}
                        </span>
                    ))}
                </div>
              )}

              {step.status === StepStatus.FAILED && (
                  <div className="mt-2 text-xs text-red-400 bg-red-900/10 p-2 rounded border border-red-900/30 flex items-center gap-2">
                      <RefreshCw className="w-3 h-3" />
                      Auto-repair activated: Retrying step...
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-900 border-t border-gray-800 text-xs text-gray-500 flex items-center justify-center gap-2">
         <Shield className="w-3 h-3" />
         <span>Sandbox Mode Active: Changes are virtual</span>
      </div>
    </div>
  );
};

export default PlanWidget;