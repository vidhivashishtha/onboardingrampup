export default function RevealPanel({ student, submission }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 className="text-sm font-semibold text-emerald-800">
            Analysis passed rubric. Here are the actual findings:
          </h3>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Your Analysis */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Your Analysis</h4>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Diagnosis</p>
            <p className="text-sm text-gray-700">{submission.diagnosis}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Academic Intervention</p>
            <p className="text-sm text-gray-700">{submission.intervention}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Motivational Strategy</p>
            <p className="text-sm text-gray-700">{submission.motivation}</p>
          </div>
        </div>

        {/* Actual Findings */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Answer Key</h4>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600 mb-1">Academic Issues & Fix</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{student.academic_issues}</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600 mb-1">Motivational Issues</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{student.motivational_issues}</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600 mb-1">Motivational Action Plan</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{student.motivational_action_plan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
