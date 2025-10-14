import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions {
  value: string;
  onSave: () => Promise<void>;
  enabled: boolean;
  debounceMs?: number;
  intervalMs?: number;
}

export function useAutoSave({
  value,
  onSave,
  enabled,
  debounceMs = 3000,
  intervalMs = 30000,
}: UseAutoSaveOptions) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedValueRef = useRef<string>(value);
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSave = useCallback(async () => {
    if (!enabled || value === lastSavedValueRef.current) {
      return;
    }

    setAutoSaveStatus('saving');
    
    try {
      await onSave();
      lastSavedValueRef.current = value;
      setAutoSaveStatus('saved');

      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
      statusTimeoutRef.current = setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('idle');
    }
  }, [value, onSave, enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, enabled, debounceMs, performSave]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    intervalTimerRef.current = setInterval(() => {
      performSave();
    }, intervalMs);

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [enabled, intervalMs, performSave]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  return { autoSaveStatus };
}
