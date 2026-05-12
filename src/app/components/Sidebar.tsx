import { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronLeft, Search, HardDrive, FileStack, Database, PanelLeftClose, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { folders, FolderItem } from '../data/mockData';
import { useApp } from '../context/AppContext';

function FolderNode({ item, depth = 0, onSelect, selectedId }: {
  item: FolderItem;
  depth?: number;
  onSelect: (item: FolderItem) => void;
  selectedId: string | null;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(item.id === 'tree1' || item.id === 'clarity-capital' || item.id === 'apicem-investments');
  const isActive = selectedId === item.id;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(e => !e);
    }
    onSelect(item);
  };

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
        className={`w-full flex items-center gap-2 py-1.5 pr-3 rounded-lg group transition-all duration-150 text-left ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <span className="shrink-0 flex items-center">
          {hasChildren ? (
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </motion.span>
          ) : (
            <span className="w-3" />
          )}
        </span>
        <span className="shrink-0">
          {isActive || expanded
            ? <FolderOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            : <Folder className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-500" />
          }
        </span>
        <span className="flex-1 truncate text-sm" style={{ fontWeight: isActive ? 600 : 400 }}>
          {item.name}
        </span>
        <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-md ${
          isActive
            ? 'bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-300'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        }`} style={{ fontWeight: 500, fontSize: '10px' }}>
          {formatCount(item.count)}
        </span>
      </button>

      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {item.children!.map(child => (
              <FolderNode
                key={child.id}
                item={child}
                depth={depth + 1}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ width = 296 }: { width?: number }) {
  const { selectedFolder, setSelectedFolder, sidebarCollapsed, setSidebarCollapsed, setSelectedDocument } = useApp();
  const [searchVal, setSearchVal] = useState('');

  const filteredFolders = searchVal
    ? folders.filter(f => f.name.toLowerCase().includes(searchVal.toLowerCase()))
    : folders;

  const handleSelect = (item: FolderItem) => {
    setSelectedFolder(item);
    setSelectedDocument(null);
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 48 : width }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden"
    >
      {sidebarCollapsed ? (
        <div className="flex flex-col items-center py-3 gap-2">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-px bg-slate-200 dark:bg-slate-700" />
          {folders.slice(0, 10).map(f => (
            <button
              key={f.id}
              onClick={() => { setSidebarCollapsed(false); handleSelect(f); }}
              title={f.name}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                selectedFolder?.id === f.id
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Folder className="w-4 h-4" />
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Archive Stats */}
          <div className="px-3 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide" style={{ fontWeight: 600 }}>Archive</span>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <HardDrive className="w-3 h-3" />
                  <span className="text-xs">Archive Size</span>
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-300" style={{ fontWeight: 600 }}>43</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <FileStack className="w-3 h-3" />
                  <span className="text-xs">Files Count</span>
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-300" style={{ fontWeight: 600 }}>3,317,938</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Database className="w-3 h-3" />
                  <span className="text-xs">Files Size</span>
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-300" style={{ fontWeight: 600 }}>3.72 MB</span>
              </div>
            </div>
            {/* Storage bar */}
            <div className="mt-2">
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[62%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">62% storage used</p>
            </div>
          </div>

          {/* Search folders */}
          <div className="px-3 py-2 shrink-0">
            <div className="flex items-center gap-2 h-8 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Search className="w-3 h-3 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Filter folders..."
                className="flex-1 bg-transparent outline-none text-xs text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Folders label */}
          <div className="px-3 mb-1 shrink-0">
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
              Document Classes
            </span>
          </div>

          {/* Folder tree */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#e2e8f0 transparent',
          }}>
            <div className="space-y-0.5">
              {filteredFolders.map(folder => (
                <FolderNode
                  key={folder.id}
                  item={folder}
                  onSelect={handleSelect}
                  selectedId={selectedFolder?.id || null}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </motion.aside>
  );
}
