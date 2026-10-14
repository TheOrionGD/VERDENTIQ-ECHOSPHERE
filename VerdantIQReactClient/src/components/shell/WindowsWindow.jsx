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
      className={`liquid-glass-panel flex flex-col transition-all duration-300 z-10 w-full h-full rounded-2xl shadow-2xl overflow-hidden border border-white/15 ${
        isMaximized
          ? 'fixed inset-x-2 top-2 bottom-14'
          : 'relative w-[96%] h-[92%] mx-auto mt-2'
      }`}
    >
      {/* Windows 11 Title Bar */}
      <div 
        onDoubleClick={() => setIsMaximized(!isMaximized)}
        className={`h-10 px-4 flex items-center justify-between border-b select-none transition-colors cursor-default ${
          isDarkMode ? 'border-white/10 bg-neutral-900/80 backdrop-blur-md' : 'border-slate-300/80 bg-slate-100/90 backdrop-blur-md'
        }`}
      >
        {/* Left: Window Icon & Title */}
        <div className="flex items-center space-x-2.5">
          {Icon && <Icon className="w-4 h-4 text-emerald-400" />}
          <span className="text-xs font-semibold text-white tracking-tight">{title}</span>
          {roleBadge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-medium">
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
        isDarkMode ? 'border-white/10 bg-neutral-950/70 backdrop-blur-md' : 'border-slate-300/80 bg-slate-200/60 backdrop-blur-md'
      }`}>
        <div className="flex items-center space-x-1.5 text-xs text-neutral-300 mr-2 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-white font-mono text-[11px] tracking-wide uppercase">{roleMeta.label}:</span>
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
                  : 'text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/15'
              }`}
            >
              <GripVertical className="w-3 h-3 text-white/30 group-hover:text-white/60 cursor-grab active:cursor-grabbing" />
              <span>{screen.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/30' : 'bg-neutral-800/80 text-neutral-400'}`}>
                {screen.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Window Body Workspace */}
      <div className={`flex-1 min-h-0 overflow-y-auto fluent-scrollbar p-6 transition-colors ${
        isDarkMode ? 'bg-neutral-950/90 text-slate-100' : 'bg-slate-900/95 text-slate-100'
      }`}>
        {children}
      </div>
    </div>
  );
}
