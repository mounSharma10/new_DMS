import { X, GitBranch, File } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VersionNode {
  name: string;
  version?: string;
  children?: VersionNode[];
  isActive?: boolean;
}

function TreeNode({ node, depth = 0 }: { node: VersionNode; depth?: number }) {
  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer transition-colors ${
          node.isActive
            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700'
            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
        }`}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        {depth === 0 ? (
          <File className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <GitBranch className="w-4 h-4 text-indigo-400 shrink-0" />
        )}
        <span
          className={`text-sm ${
            node.isActive
              ? 'text-amber-600 dark:text-amber-400 underline'
              : 'text-slate-700 dark:text-slate-300'
          }`}
          style={{ fontWeight: node.isActive ? 600 : 400 }}
        >
          {node.name}
        </span>
        {node.version && !node.isActive && (
          <span className="text-xs text-indigo-500 dark:text-indigo-400">({node.version})</span>
        )}
      </div>
      {node.children?.map((child, i) => (
        <TreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  docName?: string;
}

export function VersionTreeModal({ open, onClose, docName }: Props) {
  const tree: VersionNode = {
    name: docName || 'ddd.pdf',
    version: 'version-1.0',
    children: [
      {
        name: 'version-1.1',
        children: [
          { name: 'version-1.1.1', isActive: true, children: [] }
        ]
      }
    ]
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm mx-4"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-slate-900 dark:text-white" style={{ fontWeight: 600, fontSize: '15px' }}>
                  Document Version Tree
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              <TreeNode node={tree} />
            </div>
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
