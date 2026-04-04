export default function RubricRejection({ result, onDismiss }) {
  if (!result || result.passed) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-800 mb-1">
            {result.rule.name}
          </h4>
          <p className="text-sm text-red-700">{result.detail}</p>
          <button
            onClick={onDismiss}
            className="mt-3 text-xs font-medium text-red-600 hover:text-red-800 underline cursor-pointer"
          >
            Revise and try again
          </button>
        </div>
      </div>
    </div>
  );
}
