import React, { useState } from 'react';
import { 
  Minus, 
  Square, 
  Copy,
  X, 
  Sparkles,
  GripVertical
} from 'lucide-react';
import { useAuth } from '../../lib/useAuth';

export function WindowsWindow({ title, icon: Icon, children, roleBadge, onClose }) {
  const [isMaximized, setIsMaximized] = useState(true);
  const { 
    availableScreens, 
    activeScreen, 
    setActiveScreen, 
    reorderScreens,
    roleMeta, 
    isDarkMode, 
    isWindowMinimized, 
    setIsWindowMinimized 
  } = useAuth();

  // Drag and drop state for tabs
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // If window is minimized, hide it from desktop (can be restored via taskbar)
  if (isWindowMinimized) {
    return null;
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderScreens(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div
      className={`liquid-glass-panel flex flex-col transition-all duration-300 z-10 rounded-2xl shadow-2xl overflow-hidden border ${
        isDarkMode ? 'border-white/15' : 'border-slate-300/80 shadow-slate-900/15'
      } ${
        isMaximized
          ? 'fixed inset-x-2 top-2 bottom-14 w-auto h-auto'
          : 'relative w-[96%] h-[92%] min-w-[320px] min-h-[300px] max-w-full max-h-full mx-auto mt-2 resize overflow-auto'
      }`}
    >
      {/* Windows 11 Title Bar */}
      <div 
        onDoubleClick={() => setIsMaximized(!isMaximized)}
        className={`h-10 px-4 flex items-center justify-between border-b select-none transition-colors cursor-default ${
          isDarkMode ? 'border-white/10 bg-neutral-900/80 backdrop-blur-md text-white' : 'border-slate-300/80 bg-slate-100/90 backdrop-blur-md text-slate-800'
        }`}
      >
        {/* Left: Window Icon & Title */}
        <div className="flex items-center space-x-2.5">
          {Icon && <Icon className="w-4 h-4 text-emerald-500" />}
          <span className={`text-xs font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</span>
          {roleBadge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 font-mono font-medium">
              {roleBadge}
            </span>
          )}
        </div>

        {/* Right: Windows Caption Controls (Minimize, Maximize / Restore, Close) */}
        <div className="flex items-center space-x-0.5">
          {/* 1. Minimize to Taskbar */}
          <button 
            onClick={() => setIsWindowMinimized(true)}
            className="win-caption-btn" 
            title="Minimize to Taskbar"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* 2. Maximize / Restore */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="win-caption-btn"
            title={isMaximized ? 'Restore Down' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
          </button>

          {/* 3. Close / Exit Session */}
          <button 
            onClick={onClose}
            className="win-caption-btn close" 
            title="Close / Exit Workspace"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Windows 11 Fluent Sub-Navigation Ribbon (Multi-Screen Tab Bar with Drag & Drop Tab Moving) */}
      <div className={`h-11 px-3 flex items-center space-x-2 border-b overflow-x-auto scrollbar-none transition-colors ${
        isDarkMode ? 'border-white/10 bg-neutral-950/70 backdrop-blur-md' : 'border-slate-300/80 bg-slate-200/90 backdrop-blur-md'
      }`}>
        <div className={`flex items-center space-x-1.5 text-xs mr-2 flex-shrink-0 ${isDarkMode ? 'text-neutral-300' : 'text-slate-700'}`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span className={`font-semibold font-mono text-[11px] tracking-wide uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{roleMeta.label}:</span>
        </div>

        {availableScreens.map((screen, index) => {
          const isActive = activeScreen === screen.id;
          const isDraggingThis = draggedIndex === index;
          const isHoveredTarget = dragOverIndex === index;

          return (
            <div
              key={screen.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => setActiveScreen(screen.id)}
              title={`${screen.label} (${screen.category}) — Drag to reorder`}
              className={`group px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 flex-shrink-0 cursor-pointer select-none border backdrop-blur-md ${
                isDraggingThis ? 'opacity-40 scale-95 border-dashed border-emerald-400' : ''
              } ${
                isHoveredTarget ? 'border-emerald-400 bg-emerald-500/20 translate-x-1' : 'border-transparent'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-emerald-400/40 scale-[1.01]'
                  : isDarkMode
                    ? 'text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/15'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60 hover:border-slate-400/40'
              }`}
            >
              <GripVertical className={`w-3 h-3 ${isDarkMode ? 'text-white/30 group-hover:text-white/60' : 'text-slate-400 group-hover:text-slate-700'} cursor-grab active:cursor-grabbing`} />
              <span>{screen.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                isActive 
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/30' 
                  : isDarkMode
                    ? 'bg-neutral-800/80 text-neutral-400'
                    : 'bg-slate-300/80 text-slate-600'
              }`}>
                {screen.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Window Body Workspace with High-Contrast Dark & Light Mode Theme Support */}
      <div className={`flex-1 min-h-0 overflow-y-auto fluent-scrollbar p-6 transition-colors ${
        isDarkMode ? 'bg-neutral-950/90 text-slate-100' : 'bg-slate-50/95 text-slate-900'
      }`}>
        {children}
      </div>
    </div>
  );
}
