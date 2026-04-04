import { useState, useCallback } from 'react';

const STORAGE_KEY = 'rampup_progress';

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

// progress shape: { [studentId]: { status: 'completed'|'in_progress', attempts: number } }
export function useRampUpProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const markCompleted = useCallback((studentId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          status: 'completed',
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const incrementAttempt = useCallback((studentId) => {
    setProgress((prev) => {
      const current = prev[studentId] || { status: 'in_progress', attempts: 0 };
      const next = {
        ...prev,
        [studentId]: {
          ...current,
          status: 'in_progress',
          attempts: current.attempts + 1,
        },
      };
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

  return { progress, markCompleted, incrementAttempt, getCompletedCount, resetProgress };
}
