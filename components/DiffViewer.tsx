import React from 'react';
import { FileDiff } from '../types';
import { GitPullRequest, Layout } from './Icons';

interface DiffViewerProps {
  diff: FileDiff | null;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ diff }) => {
  if (!diff) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-editor-bg text-gray-500">
        <Layout className="w-16 h-16 opacity-10 mb-4" />
        <p>Select a modified file to view diff</p>
      </div>
    );
  }

  const processLines = (text: string) => text.trim().split('\n');
  const originalLines = processLines(diff.original);
  const modifiedLines = processLines(diff.modified);

  // Very naive diffing for visualization only
  // In a real app, use 'diff' library
  const maxLines = Math.max(originalLines.length, modifiedLines.length);

  return (
    <div className="h-full flex flex-col bg-editor-bg overflow-hidden">
      {/* Diff Header */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <GitPullRequest className="w-4 h-4 text-indigo-400" />
          <span className="opacity-50">src / </span>
          <span className="font-medium">{diff.filePath.split('/').pop()}</span>
          <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {diff.status.toUpperCase()}
          </span>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
             <div className="w-3 h-3 bg-red-900/50 border border-red-500/30"></div>
             <span className="text-gray-500">Original</span>
          </div>
          <div className="flex items-center gap-1">
             <div className="w-3 h-3 bg-green-900/50 border border-green-500/30"></div>
             <span className="text-gray-500">Modified</span>
          </div>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-auto font-mono text-xs md:text-sm">
        <div className="flex min-h-full">
           {/* Left Pane (Original) */}
           <div className="flex-1 border-r border-gray-800 bg-gray-900/50">
             {Array.from({ length: maxLines }).map((_, i) => {
                 const line = originalLines[i];
                 const isRemoved = line && !modifiedLines.includes(line); // Naive check
                 
                 return (
                    <div key={`orig-${i}`} className={`flex hover:bg-gray-800/50 ${isRemoved ? 'bg-red-900/20' : ''}`}>
                        <div className="w-10 text-right pr-3 text-gray-600 select-none border-r border-gray-800 bg-editor-bg py-0.5">{i + 1}</div>
                        <div className={`flex-1 pl-4 py-0.5 whitespace-pre ${isRemoved ? 'text-gray-400' : 'text-gray-500'}`}>
                            {line || ''}
                        </div>
                    </div>
                 );
             })}
           </div>

           {/* Right Pane (Modified) */}
           <div className="flex-1 bg-gray-900/30">
             {Array.from({ length: maxLines }).map((_, i) => {
                 const line = modifiedLines[i];
                 const isAdded = line && !originalLines.includes(line); // Naive check

                 return (
                    <div key={`mod-${i}`} className={`flex hover:bg-gray-800/50 ${isAdded ? 'bg-green-900/20' : ''}`}>
                        <div className="w-10 text-right pr-3 text-gray-600 select-none border-r border-gray-800 bg-editor-bg py-0.5">{i + 1}</div>
                        <div className={`flex-1 pl-4 py-0.5 whitespace-pre ${isAdded ? 'text-green-100' : 'text-gray-300'}`}>
                            {line || ''}
                        </div>
                    </div>
                 );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;