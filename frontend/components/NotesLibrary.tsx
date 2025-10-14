import { useState, useEffect } from 'react';
import { X, Trash2, FileText, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBackend } from '../hooks/useBackend';
import type { Note } from '~backend/notes/list';

interface NotesLibraryProps {
  onLoadNote: (note: { id: number; title: string; content: string }) => void;
  onClose: () => void;
}

export function NotesLibrary({ onLoadNote, onClose }: NotesLibraryProps) {
  const backend = useBackend();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await backend.notes.list();
      setNotes(response.notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await backend.notes.deleteNote({ id });
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="h-full flex flex-col font-serif">
      <div className="p-4 border-b border-stone-200 dark:border-neutral-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-800 dark:text-neutral-200 transition-colors duration-200">Notes Library</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-stone-500 dark:text-neutral-400 hover:text-stone-700 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-700 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 border-b border-stone-200 dark:border-neutral-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-neutral-500" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-800 dark:text-neutral-200 placeholder:text-stone-400 dark:placeholder:text-neutral-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 text-center text-stone-500 dark:text-neutral-400 transition-colors duration-200">
            Loading notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-stone-500 dark:text-neutral-400 transition-colors duration-200">
            <FileText className="w-12 h-12 mx-auto mb-2 text-stone-300 dark:text-neutral-600" />
            {searchQuery ? (
              <>
                <p>No notes found matching "{searchQuery}"</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : (
              <>
                <p>No notes saved yet.</p>
                <p className="text-sm">Create and save your first note!</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group p-3 mb-2 border border-stone-200 dark:border-neutral-700 rounded-lg hover:bg-stone-50 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
                onClick={() => onLoadNote(note)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-stone-800 dark:text-neutral-200 truncate transition-colors duration-200">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-stone-500 dark:text-neutral-400 transition-colors duration-200">
                      <Calendar className="w-3 h-3" />
                      {formatDate(note.createdAt)}
                    </div>
                    <p className="text-sm text-stone-600 dark:text-neutral-300 mt-2 line-clamp-2 transition-colors duration-200">
                      {note.content.replace(/^#+ /, '').substring(0, 100)}
                      {note.content.length > 100 ? '...' : ''}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id, note.title);
                    }}
                    disabled={deletingId === note.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
