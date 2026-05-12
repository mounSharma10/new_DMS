import { useState, useRef } from 'react';
import {
  Search, Filter, Upload, Download, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  FileText, FileSpreadsheet, Mail, Image, File, GitBranch,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  secureTestDocuments, trouveDayMailDocuments,
  searchResults, Document
} from '../data/mockData';
import { FilterDropdown } from './FilterDropdown';
import { VersionTreeModal } from './VersionTreeModal';

function getDocIcon(type: Document['type']) {
  switch (type) {
    case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
    case 'docx': return <FileText className="w-4 h-4 text-blue-500" />;
    case 'xlsx': return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    case 'email': return <Mail className="w-4 h-4 text-violet-500" />;
    case 'img': return <Image className="w-4 h-4 text-amber-500" />;
    default: return <File className="w-4 h-4 text-slate-400" />;
  }
}

function getDocBadge(type: Document['type']) {
  const styles: Record<Document['type'], string> = {
    pdf: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    docx: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    xlsx: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    email: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
    img: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  };
  return styles[type] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-indigo-500', 'bg-violet-500', 'bg-blue-500',
    'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-teal-500'
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

const ITEMS_PER_PAGE = 6;

const searchSnippetFallback = 'Acceptance Environment and Testing prior to production use, Docuvibes environment must be fully operational. Test users testing will be performed by two customer users. The following test accounts must be created and validated for functional testing.';

function getSearchSnippet(doc: Document, query: string) {
  if (doc.type === 'email') {
    return `${doc.subject || doc.name}. ${doc.preview || ''}`;
  }

  if (doc.name.toLowerCase().includes('migratie')) {
    return searchSnippetFallback;
  }

  if (doc.name.toLowerCase().includes('dummy')) {
    return 'Demo PDF content extracted from CPA_Test. The document contains testing data, validation notes, and archive migration checks for the selected document class.';
  }

  return `${doc.name} is stored in the archive with document ID ${doc.id}. Version ${doc.version} is available for review, download, and document workflow testing.`;
}

function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return <>{text}</>;

  const parts = text.split(new RegExp(`(${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'));
  return (
    <>
      {parts.map((part, index) => (
        part.toLowerCase() === cleanQuery.toLowerCase()
          ? <mark key={`${part}-${index}`} className="bg-transparent text-slate-950 dark:text-white font-semibold">{part}</mark>
          : <span key={`${part}-${index}`}>{part}</span>
      ))}
    </>
  );
}

interface DeleteConfirmProps {
  doc: Document;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirm({ doc, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full mx-4">
        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="text-center text-slate-900 dark:text-white mb-1" style={{ fontWeight: 600, fontSize: '15px' }}>Delete Document?</h3>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-5">
          "{doc.name}" will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" style={{ fontWeight: 500 }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-9 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors" style={{ fontWeight: 500 }}>
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function DocumentList({ width = 360 }: { width?: number }) {
  const { selectedFolder, setSelectedDocument, selectedDocument, globalSearchQuery, setGlobalSearchQuery } = useApp();
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [hasFilter, setHasFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionDocName, setVersionDocName] = useState('');
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null);

  const isEmail = selectedFolder?.id === 'trouve-day-mail';
  const allDocs = (isEmail ? trouveDayMailDocuments : secureTestDocuments)
    .filter(d => !deletedIds.has(d.id));

  const filtered = allDocs.filter(d => {
    const q = search.toLowerCase();
    if (isEmail) {
      return !q || (d.sender?.toLowerCase().includes(q) || d.subject?.toLowerCase().includes(q) || d.preview?.toLowerCase().includes(q));
    }
    return !q || d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageDocs = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeSearch = (globalSearchQuery || search).trim();
  const isSearchMode = activeSearch.length > 0;
  const searchCorpus = [
    ...searchResults,
    { group: 'SecureTest', docs: secureTestDocuments.filter(d => !deletedIds.has(d.id)) },
    { group: 'TrouveDayMail', docs: trouveDayMailDocuments.filter(d => !deletedIds.has(d.id)) },
  ];
  const searchGroups = searchCorpus
    .map(group => ({
      ...group,
      docs: group.docs.filter(doc => {
        const q = activeSearch.toLowerCase();
        const haystack = [
          doc.id, doc.name, doc.version, doc.sender, doc.subject, doc.preview,
          getSearchSnippet(doc, activeSearch)
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(q);
      })
    }))
    .filter(group => group.docs.length > 0);
  const searchCount = searchGroups.reduce((sum, group) => sum + group.docs.length, 0);

  const handleDelete = (doc: Document) => {
    setDeletedIds(prev => new Set([...prev, doc.id]));
    setDeleteDoc(null);
    if (selectedDocument?.id === doc.id) setSelectedDocument(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const openVersionTree = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setVersionDocName(doc.name);
    setVersionModalOpen(true);
  };

  if (!selectedFolder) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F6F8FB] dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Select a folder to view documents</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 transition-[width] duration-200"
      style={{ width: isSearchMode ? Math.max(width, 496) : width }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-slate-900 dark:text-white truncate" style={{ fontWeight: 700, fontSize: '15px' }}>
              {isSearchMode ? 'Document Files' : selectedFolder.name}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {isSearchMode ? `Showing results for "${activeSearch}"` : 'Document Class'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-slate-900 dark:text-white" style={{ fontWeight: 700, fontSize: '18px' }}>
              {isSearchMode ? searchCount.toLocaleString() : selectedFolder.count.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{isSearchMode ? 'Search Count' : 'File Count'}</p>
          </div>
        </div>

        {/* Search + actions */}
        <div className="flex items-center gap-2 mt-3">
          <div className="min-w-0 flex-1 flex items-center gap-2 h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50 dark:focus-within:ring-indigo-900/30 transition-all">
            <Search className="w-3 h-3 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setGlobalSearchQuery(''); setPage(1); }}
              placeholder={isSearchMode ? 'Refine results...' : 'Search...'}
              className="min-w-0 flex-1 bg-transparent outline-none text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          <div className="relative shrink-0" ref={filterRef}>
            <button
              type="button"
              aria-label="Filter documents"
              onClick={() => setFilterOpen(!filterOpen)}
              className={`shrink-0 size-9 rounded-lg flex items-center justify-center transition-colors relative ${
                hasFilter
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {hasFilter && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
            <FilterDropdown
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              onApply={f => { setHasFilter(f.range !== 'this-month' || !!(f.from || f.to)); }}
            />
          </div>
          <button
            type="button"
            aria-label="Upload document"
            className="shrink-0 size-9 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Download documents"
            className="shrink-0 size-9 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Multi-select bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-lg px-3 py-1.5"
            >
              <span className="text-xs text-indigo-700 dark:text-indigo-300" style={{ fontWeight: 600 }}>
                {selectedIds.size} selected
              </span>
              <div className="flex items-center gap-2">
                <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300" style={{ fontWeight: 500 }}>
                  Export
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isSearchMode && (
        <div className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950/30" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
          {searchGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm" style={{ fontWeight: 600 }}>No matching documents</p>
              <button
                type="button"
                onClick={() => { setSearch(''); setGlobalSearchQuery(''); }}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                style={{ fontWeight: 600 }}
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <div className="pb-4">
              {searchGroups.map((group, groupIndex) => (
                <section key={group.group} className="border-b border-slate-200/70 dark:border-slate-800 last:border-b-0">
                  <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate" style={{ fontWeight: 600 }}>
                      {group.group}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                      {group.docs.length} matches
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {group.docs.map((doc, idx) => {
                      const snippet = getSearchSnippet(doc, activeSearch);
                      const matchCount = Math.max(1, (snippet.toLowerCase().match(new RegExp(activeSearch.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length);
                      return (
                        <motion.button
                          key={`${group.group}-${doc.id}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (groupIndex + idx) * 0.025 }}
                          onClick={() => setSelectedDocument(doc)}
                          className={`w-full text-left px-4 py-3 transition-colors group ${
                            selectedDocument?.id === doc.id
                              ? 'bg-blue-50 dark:bg-blue-950/30 shadow-[inset_-4px_0_0_#0f6cab]'
                              : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-3 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-950 dark:text-blue-200 shrink-0" style={{ fontWeight: 700 }}>
                              {matchCount}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-900 dark:text-slate-100" style={{ fontWeight: 600 }}>ID: {doc.id}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${getDocBadge(doc.type)}`} style={{ fontWeight: 700 }}>
                                      {doc.type}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 truncate">{doc.name}</p>
                                </div>
                                <button
                                  type="button"
                                  aria-label={`Delete ${doc.name}`}
                                  onClick={e => { e.stopPropagation(); setDeleteDoc(doc); }}
                                  className="shrink-0 opacity-0 group-hover:opacity-100 size-7 rounded-md flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="mt-2 h-6 max-w-56 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-800 dark:text-slate-200" style={{ fontWeight: 700 }}>
                                {doc.version.startsWith('v') ? doc.version : `v${doc.version}`}
                              </div>

                              <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 px-3 py-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                <HighlightedSnippet text={snippet} query={activeSearch} />
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {!isSearchMode && (
        <>
      {/* Group label */}
      {pageDocs.length > 0 && (
        <div className="px-4 py-2 shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
            Earlier
          </span>
        </div>
      )}

      {/* Document list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
        <AnimatePresence mode="popLayout">
          {pageDocs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-sm">No documents found</p>
              {search && (
                <button onClick={() => setSearch('')} className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400" style={{ fontWeight: 500 }}>
                  Clear search
                </button>
              )}
            </motion.div>
          ) : isEmail ? (
            pageDocs.map((doc, idx) => (
              <motion.button
                key={doc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedDocument(doc)}
                className={`w-full text-left px-3 py-3 border-b border-slate-100 dark:border-slate-800/50 transition-all group ${
                  selectedDocument?.id === doc.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-full ${getAvatarColor(doc.sender || 'A')} flex items-center justify-center text-white shrink-0 mt-0.5`} style={{ fontSize: '11px', fontWeight: 700 }}>
                    {(doc.sender || 'A').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-sm text-slate-800 dark:text-slate-200 truncate" style={{ fontWeight: 600 }}>
                        {doc.sender}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{doc.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate" style={{ fontWeight: 500 }}>{doc.subject}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{doc.preview}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteDoc(doc); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.button>
            ))
          ) : (
            pageDocs.map((doc, idx) => (
              <motion.button
                key={doc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedDocument(doc)}
                className={`w-full text-left px-3 py-3 border-b border-slate-100 dark:border-slate-800/50 transition-all group ${
                  selectedDocument?.id === doc.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Checkbox */}
                  <div
                    onClick={e => { e.stopPropagation(); toggleSelect(doc.id); }}
                    className={`w-4 h-4 rounded border transition-all mt-1 shrink-0 flex items-center justify-center ${
                      selectedIds.has(doc.id)
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-slate-300 dark:border-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {selectedIds.has(doc.id) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${getDocBadge(doc.type)}`}>
                    {getDocIcon(doc.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs text-slate-400 dark:text-slate-500">ID: {doc.id}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{doc.date}</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 truncate" style={{ fontWeight: 500, lineHeight: 1.3 }}>{doc.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        onClick={e => openVersionTree(doc, e)}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs transition-colors ${
                          doc.hasVersions
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/40'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        {doc.hasVersions && <GitBranch className="w-2.5 h-2.5" />}
                        v{doc.version}
                      </button>
                      {doc.size && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">{doc.size}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); setDeleteDoc(doc); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronsLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-6 h-6 rounded text-xs transition-colors ${
                    page === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                  style={{ fontWeight: page === pageNum ? 600 : 400 }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronsRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
        </>
      )}

      {/* Modals */}
      <VersionTreeModal
        open={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        docName={versionDocName}
      />
      {deleteDoc && (
        <DeleteConfirm
          doc={deleteDoc}
          onConfirm={() => handleDelete(deleteDoc)}
          onCancel={() => setDeleteDoc(null)}
        />
      )}
    </div>
  );
}
