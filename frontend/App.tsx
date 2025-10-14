import { useState, useCallback, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { NotesLibrary } from './components/NotesLibrary';
import { useAutoSave } from './hooks/useAutoSave';
import backend from '~backend/client';
import type { Note } from '~backend/notes/create';

export default function App() {
  const [content, setContent] = useState('# Welcome to Minimal Notes\n\nMinimal Notes is a sleek markdown note taker for your writing pleasure.\n\nIt stores notes in a postgres database and lets you keep track of your thoughts and other writing in a single place.\n\n## Features\n- Clean, minimalistic interface\n- Live preview\n- Download as .md files\n- Save notes to database\n- View and manage saved notes\n- Dark/Light mode\n\n**Happy writing!**');
  const [showPreview, setShowPreview] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [filename, setFilename] = useState('untitled');
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, filename]);

  const handleNewNote = useCallback(() => {
    setContent('');
    setFilename('untitled');
    setCurrentNoteId(null);
    setShowLibrary(false);
  }, []);

  const handleLoadNote = useCallback((note: { id: number; title: string; content: string }) => {
    setContent(note.content);
    setFilename(note.title);
    setCurrentNoteId(note.id);
    setShowLibrary(false);
  }, []);

  const handleAutoSave = useCallback(async () => {
    if (!filename.trim()) {
      return;
    }

    try {
      let note: Note;
      
      if (currentNoteId) {
        note = await backend.notes.update({
          id: currentNoteId,
          title: filename,
          content: content,
        });
      } else {
        note = await backend.notes.create({
          title: filename,
          content: content,
        });
        setCurrentNoteId(note.id);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [filename, content, currentNoteId]);

  const { autoSaveStatus } = useAutoSave({
    value: content,
    onSave: handleAutoSave,
    enabled: !!filename.trim() && content.length > 0,
    debounceMs: 3000,
    intervalMs: 30000,
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900 flex flex-col transition-colors duration-200 font-serif">
      <Toolbar
        filename={filename}
        onFilenameChange={setFilename}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        showLibrary={showLibrary}
        onToggleLibrary={() => setShowLibrary(!showLibrary)}
        onDownload={handleDownload}
        onNewNote={handleNewNote}
        content={content}
        currentNoteId={currentNoteId}
        onNoteSaved={(note) => {
          setCurrentNoteId(note.id);
          setFilename(note.title);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        autoSaveStatus={autoSaveStatus}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {showLibrary && (
          <div className="w-80 border-r border-stone-200 dark:border-neutral-700 bg-stone-25 dark:bg-neutral-800 transition-colors duration-200">
            <NotesLibrary
              onLoadNote={handleLoadNote}
              onClose={() => setShowLibrary(false)}
            />
          </div>
        )}
        
        <div className={`transition-all duration-300 ease-in-out ${
          showPreview ? (showLibrary ? 'w-1/2' : 'w-1/2') : (showLibrary ? 'flex-1' : 'w-full')
        }`}>
          <Editor
            content={content}
            onChange={setContent}
            className="h-full"
          />
        </div>
        
        {showPreview && (
          <div className="w-1/2 border-l border-stone-200 dark:border-neutral-700 transition-all duration-300 ease-in-out">
            <Preview content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
