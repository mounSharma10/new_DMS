import { useState } from 'react';
import {
  ZoomIn, ZoomOut, RotateCcw, RotateCw,
  Download, Printer, Save, Share2, Bookmark, MessageSquare,
  Edit3, Info, X,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

function PDFPreview({ docName }: { docName: string }) {
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Fake PDF content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded mb-1.5" />
            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded" />
          </div>
          <div className="text-right">
            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded mb-1.5 ml-auto" />
            <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded ml-auto" />
          </div>
        </div>

        {/* Highlighted header from screenshot */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-3">
          <p className="text-xs text-amber-800 dark:text-amber-300" style={{ fontWeight: 600 }}>
            Ontvangst formulier (P2413933X100X1X1)
          </p>
          <div className="flex gap-4 mt-1">
            <span className="text-xs text-amber-700 dark:text-amber-400">RGOOFY2</span>
            <span className="text-xs text-amber-700 dark:text-amber-400">Afgedrukt 01-08-2025 15:34:24</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            ['Ontvangst datum:', '30-12-2024'],
            ['Poort:', 'M-DOCK11'],
            ['Vervoerder:', '—'],
            ['Leverancier:', '1207907'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
              <p className="text-xs text-slate-700 dark:text-slate-300" style={{ fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
          {[
            'A.E.S. BV',
            'Artnr: 300308-012    Verkoopordersnr:    Verwacht aantal: 5000',
            'Omschrijving: ah pineapple slices juice 227g',
            'EAN barcode: 8710265530461',
          ].map((line, i) => (
            <div key={i} className="h-2 bg-slate-100 dark:bg-slate-700 rounded" style={{ width: `${60 + (i * 13) % 40}%` }} />
          ))}
        </div>

        {/* Barcode simulation */}
        <div className="flex items-center gap-2 pt-2">
          <div className="h-8 flex gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="bg-slate-800 dark:bg-slate-300" style={{ width: i % 3 === 0 ? 2 : 1, height: '100%' }} />
            ))}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">0041500070</div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
          Inruil groep: M-TIEL · Gewicht: 3.64 kg · Dragertype: 201 · Max aantal op drager: 189
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Ontvangst melding</p>
      </div>

      {/* Page indicator */}
      <div className="flex items-center justify-center py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
        <span className="text-xs text-slate-400 dark:text-slate-500">Page 1 of 1</span>
      </div>
    </div>
  );
}

function EmailPreview({ doc }: { doc: any }) {
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <p className="text-slate-900 dark:text-white" style={{ fontWeight: 700, fontSize: '15px' }}>{doc.subject || doc.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <span className="text-indigo-600 dark:text-indigo-400" style={{ fontSize: '10px', fontWeight: 700 }}>
              {(doc.sender || 'A').charAt(0)}
            </span>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-300" style={{ fontWeight: 500 }}>{doc.sender}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">· {doc.date}</span>
        </div>
      </div>
      <div className="p-6 space-y-3">
        {[
          'Thank you for reaching out to AvePoint Technical Support.',
          'We have received your inquiry and our team is reviewing the details of your request.',
          'In the meantime, please ensure that your environment meets the following prerequisites:',
        ].map((p, i) => (
          <p key={i} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p}</p>
        ))}
        <ul className="space-y-1 pl-4">
          {['Preservation of the existing document structure', 'Retention of document classifications', 'Secure and complete transfer of all historical data'].map(item => (
            <li key={item} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-700">
          Best regards,<br />
          <span style={{ fontWeight: 600 }}>AvePoint Technical Support Team</span>
        </p>
      </div>
    </div>
  );
}

export function DocumentViewer() {
  const { selectedDocument, setViewerCollapsed, viewerCollapsed } = useApp();
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveVersion = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  if (!selectedDocument) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F6F8FB] dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center mx-auto mb-5 border border-slate-100 dark:border-slate-700">
            <FileText className="w-9 h-9 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 mb-2" style={{ fontWeight: 600, fontSize: '16px' }}>No document selected</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Click on a document to preview it here</p>
        </motion.div>
      </div>
    );
  }

  const isEmail = selectedDocument.type === 'email';

  return (
    <div className="flex-1 flex flex-col bg-[#F6F8FB] dark:bg-slate-950 overflow-hidden">
      {/* Viewer toolbar */}
      <div className="h-12 shrink-0 flex items-center gap-2 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 dark:text-slate-200 truncate" style={{ fontWeight: 600 }}>
            {selectedDocument.name}
            {selectedDocument.version && (
              <span className="ml-2 text-xs text-slate-400 dark:text-slate-500" style={{ fontWeight: 400 }}>
                (version-{selectedDocument.version})
              </span>
            )}
          </p>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!isEmail && (
            <>
              <button
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-center" style={{ fontWeight: 500 }}>{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(200, z + 10))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            </>
          )}

          <button
            onClick={() => setBookmarked(b => !b)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              bookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Save Version */}
          <button
            onClick={handleSaveVersion}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs transition-all ${
              saveSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
            }`}
            style={{ fontWeight: 600 }}
          >
            <Save className="w-3 h-3" />
            {saveSuccess ? 'Saved!' : 'Save Version'}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              showInfo ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
          <motion.div
            key={selectedDocument.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', maxWidth: 680, margin: '0 auto' }}
          >
            {isEmail ? (
              <EmailPreview doc={selectedDocument} />
            ) : (
              <PDFPreview docName={selectedDocument.name} />
            )}
          </motion.div>
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shrink-0"
            >
              <div className="w-60 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-900 dark:text-white" style={{ fontWeight: 600 }}>Document Info</span>
                  <button onClick={() => setShowInfo(false)} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Document ID', value: selectedDocument.id },
                    { label: 'Name', value: selectedDocument.name },
                    { label: 'Version', value: selectedDocument.version },
                    { label: 'Type', value: selectedDocument.type?.toUpperCase() },
                    { label: 'Size', value: selectedDocument.size || '—' },
                    { label: 'Date', value: selectedDocument.date || '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 truncate" style={{ fontWeight: 500 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}