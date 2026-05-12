import { Sidebar } from './Sidebar';
import { DocumentList } from './DocumentList';
import { DocumentViewer } from './DocumentViewer';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function ResizeHandle({ onResizeStart, label }: { onResizeStart: (event: React.PointerEvent<HTMLDivElement>) => void; label: string }) {
  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      tabIndex={0}
      onPointerDown={onResizeStart}
      className="group relative z-20 w-1.5 shrink-0 cursor-col-resize bg-transparent outline-none"
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-800 transition-colors group-hover:bg-indigo-400 group-focus-visible:bg-indigo-500" />
      <div className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2" />
    </div>
  );
}

export function Dashboard() {
  const { sidebarCollapsed } = useApp();
  const [sidebarWidth, setSidebarWidth] = useState(296);
  const [documentListWidth, setDocumentListWidth] = useState(360);

  const startResize = (
    event: React.PointerEvent<HTMLDivElement>,
    width: number,
    setWidth: React.Dispatch<React.SetStateAction<number>>,
    min: number,
    max: number
  ) => {
    event.preventDefault();
    const startX = event.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handlePointerMove = (moveEvent: PointerEvent) => {
      setWidth(clamp(width + moveEvent.clientX - startX, min, max));
    };

    const stopResize = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResize);
      window.removeEventListener('pointercancel', stopResize);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResize);
    window.addEventListener('pointercancel', stopResize);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar width={sidebarWidth} />
      {!sidebarCollapsed && (
        <ResizeHandle
          label="Resize archive section"
          onResizeStart={event => startResize(event, sidebarWidth, setSidebarWidth, 240, 440)}
        />
      )}
      <DocumentList width={documentListWidth} />
      <ResizeHandle
        label="Resize document list section"
        onResizeStart={event => startResize(event, documentListWidth, setDocumentListWidth, 300, 680)}
      />
      <DocumentViewer />
    </div>
  );
}
