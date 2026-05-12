import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type FilterRange = 'today' | 'yesterday' | 'this-week' | 'this-month' | 'custom';

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (filter: { range: FilterRange; from?: string; to?: string }) => void;
}

export function FilterDropdown({ open, onClose, onApply }: Props) {
  const [selected, setSelected] = useState<FilterRange>('this-month');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const options: { value: FilterRange; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleSearch = () => {
    onApply({ range: selected, from: fromDate, to: toDate });
    onClose();
  };

  const handleClear = () => {
    setSelected('this-month');
    setFromDate('');
    setToDate('');
    onApply({ range: 'this-month' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 z-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl w-64 overflow-hidden"
          >
            <div className="p-2">
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelected(opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selected === opt.value
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  style={{ fontWeight: selected === opt.value ? 600 : 400 }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {selected === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 pb-3 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-2"
                >
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 px-3 pb-3 border-t border-slate-100 dark:border-slate-700 pt-2">
              <button
                onClick={handleClear}
                className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="flex-1 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-colors shadow-sm"
                style={{ fontWeight: 500 }}
              >
                Search
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}