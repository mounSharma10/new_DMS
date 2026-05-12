import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, FolderItem, secureTestDocuments } from '../data/mockData';

interface AppContextType {
  selectedFolder: FolderItem | null;
  setSelectedFolder: (folder: FolderItem | null) => void;
  selectedDocument: Document | null;
  setSelectedDocument: (doc: Document | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  viewerCollapsed: boolean;
  setViewerCollapsed: (v: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (v: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>({ id: 'secure-test', name: 'SecureTest', count: 1989 });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(secureTestDocuments[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewerCollapsed, setViewerCollapsed] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AppContext.Provider value={{
      selectedFolder, setSelectedFolder,
      selectedDocument, setSelectedDocument,
      isDarkMode, toggleDarkMode,
      sidebarCollapsed, setSidebarCollapsed,
      viewerCollapsed, setViewerCollapsed,
      globalSearchQuery, setGlobalSearchQuery,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
