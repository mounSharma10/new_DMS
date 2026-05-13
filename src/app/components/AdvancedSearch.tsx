import { useState } from 'react';
import {
  Search, Plus, X, Filter, Sparkles, Clock, Save,
  ChevronDown, FileText, FileSpreadsheet, Mail,
  GitBranch, Trash2, ChevronRight, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { documentClasses } from '../data/mockData';

interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string;
  conjunction: 'AND' | 'OR';
}

const searchFields = ['Search Text', 'Document ID', 'File Name', 'Date Created', 'Version', 'File Size', 'Document Class'];
const operators = ['Is', 'Is not', 'Contains', 'Does not contain', 'Starts with', 'Ends with'];

const savedFilters = [
  { id: '1', name: 'Recent PDFs', desc: 'PDF files from last 30 days', count: '1,248', updated: 'Today', icon: FileText, accent: 'blue' },
  { id: '2', name: 'Accountancy 2024', desc: 'All 2024 accountancy docs', count: '435K', updated: 'Yesterday', icon: FileSpreadsheet, accent: 'emerald' },
  { id: '3', name: 'Large Files', desc: 'Files larger than 5MB', count: '672', updated: '2 days ago', icon: GitBranch, accent: 'amber' },
  { id: '4', name: 'Mail Review', desc: 'Unread mail documents requiring review', count: '189', updated: 'Last week', icon: Mail, accent: 'violet' },
];

const accentStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
};

function SearchResultCard({ result }: { result: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-500 dark:text-slate-400" style={{ fontWeight: 600 }}>
          {result.group}
        </span>
      </div>
      {result.docs.map((doc: any) => (
        <div key={doc.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-slate-400 dark:text-slate-500">ID: {doc.id}</span>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md" style={{ fontWeight: 500 }}>
                {doc.version}
              </span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 truncate" style={{ fontWeight: 500 }}>{doc.name}</p>
            {doc.snippet && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                {doc.snippet}
              </p>
            )}
          </div>
          <button className="shrink-0 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </motion.div>
  );
}

export function AdvancedSearch() {
  const [docClass, setDocClass] = useState('');
  const [filters, setFilters] = useState<FilterRow[]>([
    { id: '1', field: 'Search Text', operator: 'Is', value: '', conjunction: 'AND' }
  ]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addFilter = () => {
    setFilters(prev => [...prev, {
      id: Date.now().toString(),
      field: 'Search Text',
      operator: 'Is',
      value: '',
      conjunction: 'AND'
    }]);
  };

  const removeFilter = (id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, key: keyof FilterRow, val: string) => {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, [key]: val } : f));
  };

  const handleSearch = () => {
    if (!docClass && filters.every(f => !f.value)) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1000);
  };

  const mockResults = [
    {
      group: 'Docuvibes_CPA',
      docs: [
        {
          id: '4445908', name: 'Migratie Invu naar Docuvibes.docx', version: 'v1.0',
          snippet: 'Acceptance Environment & Testing Prior to production use, Docuvibes environment must be fully operational by 22 January...'
        }
      ]
    },
    {
      group: 'CPA_Test',
      docs: [
        { id: '4445889', name: 'demo_dummy-pdf.pdf', version: 'v1.0', snippet: null }
      ]
    }
  ];

  const suggestions = ['SecureTest documents', 'PDF files this month', 'Invoice 2024', 'Technical reports'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F6F8FB] dark:bg-slate-950 p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-slate-900 dark:text-white mb-1" style={{ fontWeight: 700, fontSize: '22px', letterSpacing: '-0.3px' }}>
          Advanced Search
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Build powerful search queries across your document archive</p>
      </div>

      <div className="w-full">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 mb-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {[{ id: 'search', label: 'Filter Builder', icon: Filter }, { id: 'saved', label: 'Saved Filters', icon: Bookmark }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'search' ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
            >
              {/* AI Suggestion bar */}
              <div className="flex items-center gap-2 mb-5 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                <p className="text-sm text-indigo-700 dark:text-indigo-300" style={{ fontWeight: 500 }}>
                  AI suggestions:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilters(prev => [{ ...prev[0], value: s }]);
                        setShowSuggestions(false);
                      }}
                      className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/30 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                {/* Main filter card */}
                <div className="min-w-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-slate-900 dark:text-white" style={{ fontWeight: 600, fontSize: '15px' }}>Advanced Search</h3>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Document Class row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm text-slate-600 dark:text-slate-400 sm:w-32 shrink-0" style={{ fontWeight: 500 }}>
                        Document Class
                      </label>
                      <div className="relative flex-1 min-w-0">
                        <select
                          value={docClass}
                          onChange={e => setDocClass(e.target.value)}
                          className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 transition-all appearance-none cursor-pointer"
                          style={{ fontWeight: 400 }}
                        >
                          <option value="">Select Class</option>
                          {documentClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Filter rows */}
                    <div className="space-y-2.5">
                      {filters.map((filter, idx) => (
                        <motion.div
                          key={filter.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-[8rem_minmax(8rem,9rem)_minmax(0,1fr)_auto] items-center gap-2"
                        >
                          {/* Field label for first row */}
                          {idx === 0 ? (
                            <label className="text-sm text-slate-600 dark:text-slate-400" style={{ fontWeight: 500 }}>
                              {filter.field}
                            </label>
                          ) : (
                            <div className="relative">
                              <select
                                value={filter.conjunction}
                                onChange={e => updateFilter(filter.id, 'conjunction', e.target.value)}
                                className="w-full h-9 px-3 pr-7 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer"
                                style={{ fontWeight: 500 }}
                              >
                                <option>AND</option>
                                <option>OR</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                            </div>
                          )}

                          {/* Operator */}
                          <div className="relative min-w-0">
                            <select
                              value={filter.operator}
                              onChange={e => updateFilter(filter.id, 'operator', e.target.value)}
                              className="w-full h-9 px-3 pr-7 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer"
                              style={{ fontWeight: 400 }}
                            >
                              {operators.map(op => <option key={op}>{op}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                          </div>

                          {/* Value input */}
                          <input
                            type="text"
                            value={filter.value}
                            onChange={e => updateFilter(filter.id, 'value', e.target.value)}
                            placeholder="Enter search value..."
                            className="min-w-0 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                          />

                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                            {/* AND/OR connector display for first row */}
                            {idx === 0 && filters.length > 1 && (
                              <div className="relative w-20 shrink-0">
                                <select
                                  value={filters[1]?.conjunction || 'AND'}
                                  onChange={e => updateFilter(filters[1]?.id || '', 'conjunction', e.target.value)}
                                  className="w-full h-9 px-2 pr-6 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm outline-none appearance-none cursor-pointer"
                                  style={{ fontWeight: 500 }}
                                >
                                  <option>AND</option>
                                  <option>OR</option>
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                              </div>
                            )}

                            {/* Actions */}
                            <button
                              onClick={addFilter}
                              className="shrink-0 h-9 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm flex items-center gap-1 transition-colors shadow-sm"
                              style={{ fontWeight: 500 }}
                            >
                              <Plus className="w-3 h-3" />
                              Add
                            </button>
                            {filters.length > 1 && (
                              <button
                                onClick={() => removeFilter(filter.id)}
                                className="shrink-0 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                                style={{ fontWeight: 500 }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Active filter chips */}
                    {(docClass || filters.some(f => f.value)) && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {docClass && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs border border-indigo-100 dark:border-indigo-800/50" style={{ fontWeight: 500 }}>
                            Class: {docClass}
                            <button onClick={() => setDocClass('')} className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {filters.filter(f => f.value).map(f => (
                          <span key={f.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-600" style={{ fontWeight: 500 }}>
                            {f.field} {f.operator.toLowerCase()} "{f.value}"
                            <button onClick={() => updateFilter(f.id, 'value', '')} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Search button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" style={{ fontWeight: 500 }}>
                          <Save className="w-3.5 h-3.5" />
                          Save Filter
                        </button>
                        <button
                          onClick={() => { setDocClass(''); setFilters([{ id: '1', field: 'Search Text', operator: 'Is', value: '', conjunction: 'AND' }]); setHasSearched(false); }}
                          className="h-9 px-3 rounded-lg text-slate-400 dark:text-slate-500 text-sm hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          Reset
                        </button>
                      </div>
                      <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="flex items-center justify-center gap-2 h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-colors shadow-sm disabled:opacity-60"
                        style={{ fontWeight: 600 }}
                      >
                        {isSearching ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5" />
                            Search
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="min-w-0">
                  <AnimatePresence>
                    {hasSearched && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-slate-800 dark:text-slate-200" style={{ fontWeight: 600, fontSize: '14px' }}>Search Results</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">379,297 documents found</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Items per page:</span>
                          <select className="h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs outline-none">
                            <option>12</option>
                            <option>24</option>
                            <option>50</option>
                          </select>
                        </div>
                      </div>
                      {mockResults.map((result, i) => (
                        <SearchResultCard key={i} result={result} />
                      ))}

                      {/* Pagination */}
                      <div className="flex items-center justify-center gap-1 pt-2">
                        {[1, 2, 3, 4, 5].map(p => (
                          <button
                            key={p}
                            className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                              p === 1
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            style={{ fontWeight: p === 1 ? 600 : 400 }}
                          >
                            {p}
                          </button>
                        ))}
                        <span className="px-2 text-slate-400">...</span>
                        <button className="h-8 px-3 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          Next
                        </button>
                      </div>
                    </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5"
            >
              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 700, fontSize: '16px' }}>Saved Filters</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Reusable searches across the archive</p>
                  </div>
                  <button className="shrink-0 flex items-center justify-center gap-2 h-9 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm shadow-sm transition-colors" style={{ fontWeight: 600 }}>
                    <Plus className="w-4 h-4" />
                    New Filter
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
                  {savedFilters.map((sf, i) => {
                    const Icon = sf.icon;
                    return (
                      <motion.button
                        key={sf.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="min-h-36 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-left hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentStyles[sf.accent]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-500 shrink-0 mt-1" />
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-slate-900 dark:text-slate-100" style={{ fontWeight: 700 }}>{sf.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{sf.desc}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400 dark:text-slate-500">Matches</span>
                          <span className="text-sm text-slate-800 dark:text-slate-200" style={{ fontWeight: 700 }}>{sf.count}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400 dark:text-slate-500">Updated</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{sf.updated}</span>
                        </div>
                      </motion.button>
                    );
                  })}

                  <button className="min-h-36 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all" style={{ fontWeight: 600 }}>
                    <Plus className="w-5 h-5" />
                    Create new saved filter
                  </button>
                </div>
              </div>

              <aside className="space-y-3">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                      <Bookmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 dark:text-slate-100" style={{ fontWeight: 700 }}>Overview</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Saved search usage</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Filters</p>
                      <p className="text-lg text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>{savedFilters.length}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Shared</p>
                      <p className="text-lg text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>2</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-900 dark:text-slate-100 mb-3" style={{ fontWeight: 700 }}>Recent Activity</p>
                  {savedFilters.slice(0, 3).map(sf => (
                    <div key={sf.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-700 dark:text-slate-300 truncate" style={{ fontWeight: 600 }}>{sf.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{sf.updated}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
