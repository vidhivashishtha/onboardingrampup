import { useState, useEffect } from 'react';
import students from './data/students.json';
import StudentNav from './components/StudentNav';
import StudentView from './components/StudentView';
import ProgressTracker from './components/ProgressTracker';
import CompletionScreen from './components/CompletionScreen';
import { useRampUpProgress } from './hooks/useRampUpProgress';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { progress, markCompleted, getCompletedCount, resetProgress } = useRampUpProgress();
  const [showReset, setShowReset] = useState(false);

  const completed = getCompletedCount();
  const allDone = completed === students.length;
  const activeStudent = students[activeIndex];

  // Find next incomplete student when advancing
  const handleNext = () => {
    // Try to find next incomplete student after current
    for (let i = activeIndex + 1; i < students.length; i++) {
      if (progress[students[i].student_id]?.status !== 'completed') {
        setActiveIndex(i);
        return;
      }
    }
    // Wrap around
    for (let i = 0; i < activeIndex; i++) {
      if (progress[students[i].student_id]?.status !== 'completed') {
        setActiveIndex(i);
        return;
      }
    }
    // All done - just go to next
    if (activeIndex < students.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Scroll to top when switching students
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeIndex]);

  if (allDone) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <h1 className="text-base font-semibold text-gray-900">Student Deep Dive Training</h1>
          </div>
        </header>
        <CompletionScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Student Deep Dive Training</h1>
            <p className="text-xs text-gray-500">Spot learning anti-patterns across 18 students</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <ProgressTracker completed={completed} total={students.length} />
            </div>
            <button
              onClick={() => setShowReset(true)}
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Reset modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Reset Progress?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will clear all your completed analyses. Are you sure?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowReset(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setActiveIndex(0);
                  setShowReset(false);
                }}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <StudentNav
          students={students}
          activeIndex={activeIndex}
          progress={progress}
          onSelect={setActiveIndex}
        />

        {/* Mobile student selector */}
        <div className="lg:hidden w-full overflow-x-auto border-b border-gray-200 bg-white">
          <div className="flex">
            {students.map((s, i) => {
              const isActive = i === activeIndex;
              const isDone = progress[s.student_id]?.status === 'completed';
              return (
                <button
                  key={s.student_id}
                  onClick={() => setActiveIndex(i)}
                  className={`px-3 py-2.5 text-xs whitespace-nowrap border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-blue-500 text-blue-600 font-medium'
                      : isDone
                        ? 'border-transparent text-emerald-500'
                        : 'border-transparent text-gray-500'
                  }`}
                >
                  {i + 1}. {s.student_name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 max-w-3xl" key={activeStudent.student_id}>
          <StudentView
            student={activeStudent}
            isCompleted={progress[activeStudent.student_id]?.status === 'completed'}
            onComplete={() => markCompleted(activeStudent.student_id)}
            onNext={handleNext}
            isLast={activeIndex === students.length - 1 && completed === students.length - 1}
          />
        </main>
      </div>
    </div>
  );
}
