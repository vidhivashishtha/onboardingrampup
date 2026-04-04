const subjectColors = {
  Math: 'bg-blue-500',
  Reading: 'bg-violet-500',
  Language: 'bg-amber-500',
  Science: 'bg-emerald-500',
};

export default function StudentNav({ students, activeIndex, progress, onSelect }) {
  return (
    <nav className="w-60 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] p-4 hidden lg:block overflow-y-auto">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Students</p>
      <div className="space-y-0.5">
        {students.map((student, i) => {
          const isActive = i === activeIndex;
          const status = progress[student.student_id];
          const isCompleted = status?.status === 'completed';

          return (
            <button
              key={student.student_id}
              onClick={() => onSelect(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <div className={`w-2 h-2 rounded-full shrink-0 ${subjectColors[student.subject] || 'bg-gray-400'}`} />
                )}
                <span className="truncate">{student.student_name}</span>
              </div>
              <div className="ml-5 mt-0.5">
                <span className="text-xs text-gray-400">{student.subject} · {student.campus.replace('Alpha School ', '').replace('Nova Academy ', '')}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
