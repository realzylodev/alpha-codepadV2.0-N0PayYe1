import { Download, Eye, EyeOff, FileText, Plus, Save, Library, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import backend from '~backend/client';
import type { Note } from '~backend/notes/create';

interface ToolbarProps {
  filename: string;
  onFilenameChange: (filename: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  showLibrary: boolean;
  onToggleLibrary: () => void;
  onDownload: () => void;
  onNewNote: () => void;
  content: string;
  currentNoteId: number | null;
  onNoteSaved: (note: Note) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Toolbar({
  filename,
  onFilenameChange,
  showPreview,
  onTogglePreview,
  showLibrary,
  onToggleLibrary,
  onDownload,
  onNewNote,
  content,
  currentNoteId,
  onNoteSaved,
  isDarkMode,
  onToggleDarkMode,
}: ToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (saveStatus === 'success') {
      const timer = setTimeout(() => {
        setSaveStatus('idle');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleSave = async () => {
    if (!filename.trim()) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      let note: Note;
      
      if (currentNoteId) {
        // Update existing note
        note = await backend.notes.update({
          id: currentNoteId,
          title: filename,
          content: content,
        });
      } else {
        // Create new note
        note = await backend.notes.create({
          title: filename,
          content: content,
        });
      }
      
      onNoteSaved(note);
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-stone-25 dark:bg-neutral-800 border-b border-stone-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-200 font-serif">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-stone-600 dark:text-neutral-400 transition-colors duration-200" />
          <Input
            value={filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            className="border-none bg-transparent text-xl font-normal text-stone-800 dark:text-neutral-200 focus:ring-0 focus:border-none p-2 h-auto transition-colors duration-200"
            placeholder="Untitled"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          />
          <span className="text-stone-500 dark:text-neutral-400 text-sm transition-colors duration-200">.md</span>
          
          {/* Save Status Indicator */}
          <div className="flex items-center ml-2">
            {isSaving && (
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
            )}
            {saveStatus === 'success' && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
            {saveStatus === 'error' && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-700 transition-colors duration-200"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 mr-2" />
              Light
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNewNote}
          className="text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLibrary}
          className={`transition-colors duration-200 ${
            showLibrary 
              ? 'text-stone-800 dark:text-neutral-200 hover:text-stone-900 dark:hover:text-neutral-100 bg-stone-100 dark:bg-neutral-700 hover:bg-stone-150 dark:hover:bg-neutral-600' 
              : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-700'
          }`}
        >
          <Library className="w-4 h-4 mr-2" />
          {showLibrary ? 'Hide Library' : 'Library'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-700 transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePreview}
          className={`transition-colors duration-200 ${
            showPreview 
              ? 'text-stone-800 dark:text-neutral-200 hover:text-stone-900 dark:hover:text-neutral-100 bg-stone-100 dark:bg-neutral-700 hover:bg-stone-150 dark:hover:bg-neutral-600' 
              : 'text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-700'
          }`}
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          className="text-stone-600 dark:text-neutral-400 hover:text-stone-800 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-700 transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}
