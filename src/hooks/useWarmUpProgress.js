import { useState, useCallback } from 'react';

const STORAGE_KEY = 'warmup_progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useWarmUpProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const markCompleted = useCallback((studentId) => {
    setProgress((prev) => {
      const next = { ...prev, [studentId]: { status: 'completed' } };
      saveProgress(next);
      return next;
    });
  }, []);

  const getCompletedCount = useCallback(() => {
    return Object.values(progress).filter((p) => p.status === 'completed').length;
  }, [progress]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({});
  }, []);

  return { progress, markCompleted, getCompletedCount, resetProgress };
}
