import { useState } from 'react';
import { logToSheet } from '../utils/sheetLogger';

export default function FeedbackBox({ stage, studentName, studentId }) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    logToSheet({
      stage,
      studentName: studentName || '',
      studentId: studentId || '',
      result: 'Feedback',
      feedback: text.trim(),
    });
    setSent(true);
    setTimeout(() => {
      setText('');
      setSent(false);
    }, 2000);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Stuck or have feedback?
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g. Can't find this student on StudyReel..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={sent}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sent}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            sent
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {sent ? 'Sent' : 'Send'}
        </button>
      </div>
    </div>
  );
}
