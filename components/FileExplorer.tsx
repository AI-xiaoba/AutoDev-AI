import React, { useState } from 'react';
import { FileNode } from '../types';
import { Folder, FileCode, ChevronRight, ChevronDown } from './Icons';

interface FileExplorerProps {
  files: FileNode[];
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
}

const FileNodeItem: React.FC<{ node: FileNode; level: number; onSelect: (path: string) => void; selected: string | null }> = ({ node, level, onSelect, selected }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selected === node.path;

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onSelect(node.path);
    }
  };

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-800 ${isSelected ? 'bg-indigo-900/30 text-indigo-300 border-l-2 border-indigo-500' : 'text-gray-400 border-l-2 border-transparent'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="mr-1.5 opacity-70">
            {node.type === 'folder' ? (
                isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
            ) : <span className="w-3 h-3 inline-block" />}
        </span>
        
        {node.type === 'folder' ? (
          <Folder className={`w-4 h-4 mr-2 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
        ) : (
          <FileCode className={`w-4 h-4 mr-2 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileNodeItem key={child.path} node={child} level={level + 1} onSelect={onSelect} selected={selected} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onSelectFile, selectedFile }) => {
  return (
    <div className="h-full bg-editor-sidebar flex flex-col border-r border-gray-800">
      <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider pl-4">Explorer</div>
      <div className="flex-1 overflow-y-auto">
        {files.map((node) => (
          <FileNodeItem key={node.path} node={node} level={0} onSelect={onSelectFile} selected={selectedFile} />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;