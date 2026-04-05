import { useState, useEffect } from 'react';
import warmupStudents from '../data/warmup_students.json';
import { ANTI_PATTERNS } from '../constants/antiPatterns';
import { useWarmUpProgress } from '../hooks/useWarmUpProgress';
import ProgressTracker from './ProgressTracker';

function QuizCard({ student, isCompleted, onComplete, onNext, isLast }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(isCompleted);

  const toggle = (id) => {
    if (submitted) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
    onComplete();
  };

  const handleNext = () => {
    setSelected([]);
    setSubmitted(false);
    onNext();
  };

  const correctSet = new Set(student.answer_patterns);
  const selectedSet = new Set(selected);

  // Scoring
  const hits = selected.filter((s) => correctSet.has(s));
  const misses = student.answer_patterns.filter((a) => !selectedSet.has(a));
  const falsePositives = selected.filter((s) => !correctSet.has(s));

  return (
    <div className="space-y-6">
      {/* Student header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-semibold text-gray-900">{student.student_name}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {student.student_id}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {student.campus} · {student.level} · {student.subject}
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          Look up <span className="font-medium">{student.student_name.split(' ')[0]}&apos;s {student.subject}</span> learning sessions on{' '}
          <span className="font-medium">{student.campus === 'Strata' ? 'TimeBack Flow or Vault' : 'StudyReel'}</span>.
          {' '}Review their learning behaviour, and select all learning anti-patterns you observe below.
        </p>
      </div>

      {/* Anti-pattern checklist */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Which anti-patterns do you observe? Select all that apply.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ANTI_PATTERNS.map((pattern) => {
            const isSelected = selected.includes(pattern.id);
            const isCorrect = correctSet.has(pattern.id);

            let style = 'border-gray-200 bg-white hover:border-gray-300';
            if (submitted) {
              if (isCorrect && isSelected) {
                style = 'border-emerald-300 bg-emerald-50';
              } else if (isCorrect && !isSelected) {
                style = 'border-amber-300 bg-amber-50';
              } else if (!isCorrect && isSelected) {
                style = 'border-red-300 bg-red-50';
              } else {
                style = 'border-gray-100 bg-gray-50 opacity-60';
              }
            } else if (isSelected) {
              style = 'border-blue-300 bg-blue-50';
            }

            return (
              <button
                key={pattern.id}
                onClick={() => toggle(pattern.id)}
                disabled={submitted}
                className={`flex items-center gap-2.5 text-left rounded-lg border px-3 py-2.5 text-sm transition-colors cursor-pointer disabled:cursor-default ${style}`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  submitted
                    ? isCorrect && isSelected
                      ? 'bg-emerald-500 border-emerald-500'
                      : isCorrect && !isSelected
                        ? 'bg-amber-500 border-amber-500'
                        : !isCorrect && isSelected
                          ? 'bg-red-500 border-red-500'
                          : 'border-gray-300'
                    : isSelected
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                }`}>
                  {(isSelected || (submitted && isCorrect)) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={submitted && !isCorrect && !isSelected ? 'text-gray-400' : 'text-gray-700'}>
                  {pattern.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit or Results */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Submit ({selected.length} selected)
        </button>
      ) : (
        <div className="space-y-4">
          {/* Score */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-medium text-emerald-600">{hits.length}</span>
                <span className="text-gray-500"> correct</span>
              </div>
              <div>
                <span className="font-medium text-amber-600">{misses.length}</span>
                <span className="text-gray-500"> missed</span>
              </div>
              {falsePositives.length > 0 && (
                <div>
                  <span className="font-medium text-red-600">{falsePositives.length}</span>
                  <span className="text-gray-500"> incorrect</span>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              Correct
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              Missed
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
              Incorrect
            </div>
          </div>

          {/* Guide's finding */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Guide&apos;s Finding</p>
            <p className="text-sm text-gray-700">{student.guide_finding}</p>
          </div>

          {!isLast && (
            <button
              onClick={handleNext}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Next Student
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function WarmUpQuiz({ onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { progress, markCompleted, getCompletedCount, resetProgress } = useWarmUpProgress();

  const completed = getCompletedCount();
  const total = warmupStudents.length;
  const allDone = completed === total;
  const activeStudent = warmupStudents[activeIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeIndex]);

  const handleNext = () => {
    for (let i = activeIndex + 1; i < warmupStudents.length; i++) {
      if (progress[warmupStudents[i].student_id]?.status !== 'completed') {
        setActiveIndex(i);
        return;
      }
    }
    for (let i = 0; i < activeIndex; i++) {
      if (progress[warmupStudents[i].student_id]?.status !== 'completed') {
        setActiveIndex(i);
        return;
      }
    }
    if (activeIndex < warmupStudents.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  if (allDone) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Warm-Up Complete</h2>
        <p className="text-sm text-gray-600 mb-6">
          You identified anti-patterns across {total} students. Now you are ready for the full deep dive analysis.
        </p>
        <button
          onClick={onComplete}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Start Deep Dive Training
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Student pills */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {warmupStudents.map((s, i) => {
          const isActive = i === activeIndex;
          const isDone = progress[s.student_id]?.status === 'completed';
          return (
            <button
              key={s.student_id}
              onClick={() => setActiveIndex(i)}
              className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                isActive
                  ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                  : isDone
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {isDone && (
                <svg className="w-3 h-3 inline mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
              {s.student_name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressTracker completed={completed} total={total} />
      </div>

      {/* Quiz card */}
      <QuizCard
        key={activeStudent.student_id}
        student={activeStudent}
        isCompleted={progress[activeStudent.student_id]?.status === 'completed'}
        onComplete={() => markCompleted(activeStudent.student_id)}
        onNext={handleNext}
        isLast={activeIndex === warmupStudents.length - 1 && completed === total - 1}
      />
    </div>
  );
}
