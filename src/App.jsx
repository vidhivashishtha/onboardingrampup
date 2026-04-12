import { useState, useEffect } from 'react';
import students from './data/students.json';
import StudentNav from './components/StudentNav';
import StudentView from './components/StudentView';
import ProgressTracker from './components/ProgressTracker';
import CompletionScreen from './components/CompletionScreen';
import WarmUpQuiz from './components/WarmUpQuiz';
import UserIdentity from './components/UserIdentity';
import FeedbackBox from './components/FeedbackBox';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { useRampUpProgress } from './hooks/useRampUpProgress';
import { getUser, logToSheet } from './utils/sheetLogger';

const STAGE_KEY = 'rampup_stage';

function loadStage() {
  try {
    return localStorage.getItem(STAGE_KEY) || 'warmup';
  } catch {
    return 'warmup';
  }
}

export default function App() {
  const [user, setUser] = useState(getUser);
  const [stage, setStage] = useState(loadStage);
  const [activeIndex, setActiveIndex] = useState(0);
  const { progress, markCompleted, getCompletedCount, resetProgress } = useRampUpProgress();
  const [showReset, setShowReset] = useState(false);

  const completed = getCompletedCount();
  const allDone = completed === students.length;
  const activeStudent = students[activeIndex];

  const goToStage = (s) => {
    localStorage.setItem(STAGE_KEY, s);
    setStage(s);
  };

  const handleNext = () => {
    for (let i = activeIndex + 1; i < students.length; i++) {
      if (progress[students[i].student_id]?.status !== 'completed') {
        setActiveIndex(i);
        return;
      }
    }
    for (let i = 0; i < activeIndex; i++) {
      if (progress[students[i].student_id]?.status !== 'completed') {
        setActiveIndex(i);
        return;
      }
    }
    if (activeIndex < students.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeIndex]);

  // --- ADMIN ROUTE ---
  const [adminAuthed, setAdminAuthed] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  if (window.location.pathname === '/admin') {
    if (!adminAuthed) {
      return <AdminLogin onAuth={() => setAdminAuthed(true)} />;
    }
    return <AdminDashboard onLogout={() => { sessionStorage.removeItem('admin_auth'); setAdminAuthed(false); }} />;
  }

  // --- IDENTITY GATE ---
  if (!user) {
    return <UserIdentity onComplete={() => setUser(getUser())} />;
  }

  // --- WARM-UP STAGE ---
  if (stage === 'warmup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-gray-900">Student Deep Dive Training</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Warm-Up</span>
                <span className="text-xs text-gray-400">Anti-Pattern Identification</span>
              </div>
            </div>
            <button
              onClick={() => goToStage('deepdive')}
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Skip to Deep Dive
            </button>
          </div>
        </header>
        <main className="max-w-3xl mx-auto p-6">
          <WarmUpQuiz onComplete={() => goToStage('deepdive')} />
        </main>
      </div>
    );
  }

  // --- COMPLETION STAGE ---
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

  // --- DEEP DIVE STAGE ---
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToStage('warmup')}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 -ml-1"
              title="Back to Warm-Up"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Student Deep Dive Training</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Deep Dive</span>
                <span className="text-xs text-gray-400">Full analysis across 18 students</span>
              </div>
            </div>
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
        <StudentNav
          students={students}
          activeIndex={activeIndex}
          progress={progress}
          onSelect={setActiveIndex}
        />

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

        <main className="flex-1 p-6 max-w-3xl" key={activeStudent.student_id}>
          <StudentView
            student={activeStudent}
            isCompleted={progress[activeStudent.student_id]?.status === 'completed'}
            onComplete={() => {
              markCompleted(activeStudent.student_id);
              const attempts = progress[activeStudent.student_id]?.attempts || 1;
              logToSheet({
                stage: 'Deep Dive',
                studentName: activeStudent.student_name,
                studentId: activeStudent.student_id,
                result: `Passed (attempt ${attempts})`,
                attempts,
              });
            }}
            onNext={handleNext}
            isLast={activeIndex === students.length - 1 && completed === students.length - 1}
          />
          <div className="mt-6">
            <FeedbackBox
              stage="Deep Dive"
              studentName={activeStudent.student_name}
              studentId={activeStudent.student_id}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
