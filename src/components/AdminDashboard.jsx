import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'progress', 'feedback'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('progress_log')
      .select('*')
      .order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  const feedbackRows = rows.filter((r) => r.result === 'Feedback');
  const progressRows = rows.filter((r) => r.result !== 'Feedback');

  // Group progress by user
  const userProgress = {};
  progressRows.forEach((r) => {
    const key = r.user_email || r.user_name;
    if (!userProgress[key]) {
      userProgress[key] = { name: r.user_name, email: r.user_email, warmup: 0, deepdive: 0, latest: r.created_at };
    }
    if (r.stage === 'Warm-Up') userProgress[key].warmup++;
    if (r.stage === 'Deep Dive') userProgress[key].deepdive++;
  });

  const displayRows = filter === 'feedback' ? feedbackRows : filter === 'progress' ? progressRows : rows;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Ramp-Up Training — Admin</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {rows.length} total entries · {Object.keys(userProgress).length} users · {feedbackRows.length} feedback items
            </p>
          </div>
          <button
            onClick={loadData}
            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* User summary cards */}
        {Object.keys(userProgress).length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">User Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(userProgress).map((u) => (
                <div key={u.email} className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="font-medium text-sm text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{u.email}</p>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="font-medium text-blue-600">{u.warmup}</span>
                      <span className="text-gray-500"> warm-up</span>
                    </div>
                    <div>
                      <span className="font-medium text-emerald-600">{u.deepdive}</span>
                      <span className="text-gray-500"> deep dive</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback highlights */}
        {feedbackRows.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Feedback & Challenges</h2>
            <div className="space-y-2">
              {feedbackRows.map((r) => (
                <div key={r.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{r.feedback}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {r.user_name} · {r.stage}{r.student_name ? ` · ${r.student_name}` : ''} · {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full log table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Activity Log</h2>
            <div className="flex gap-1">
              {['all', 'progress', 'feedback'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                    filter === f
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Time</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Stage</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Student</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Result</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                        No entries yet
                      </td>
                    </tr>
                  ) : (
                    displayRows.map((r) => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="px-4 py-2 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-gray-700">{r.user_name}</td>
                        <td className="px-4 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            r.stage === 'Warm-Up'
                              ? 'bg-blue-50 text-blue-600'
                              : r.stage === 'Deep Dive'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-gray-50 text-gray-600'
                          }`}>
                            {r.stage}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-700">{r.student_name}</td>
                        <td className="px-4 py-2 text-gray-700">{r.result}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs max-w-xs truncate">{r.feedback}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
