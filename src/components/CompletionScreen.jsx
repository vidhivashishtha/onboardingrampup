import { COMPLETION_SCRIPT } from '../constants/rubric';

export default function CompletionScreen() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Training Complete</h2>
      <div className="text-left bg-gray-50 rounded-xl border border-gray-200 p-6">
        {COMPLETION_SCRIPT.split('\n').map((line, i) => (
          <p key={i} className={`text-sm text-gray-700 ${line.trim() ? 'mb-2' : 'mb-4'}`}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
