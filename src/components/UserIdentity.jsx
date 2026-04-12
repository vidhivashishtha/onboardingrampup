import { useState } from 'react';
import { saveUser } from '../utils/sheetLogger';

const CANDIDATE_PASSWORD = import.meta.env.VITE_CANDIDATE_PASSWORD;

export default function UserIdentity({ onComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (password !== CANDIDATE_PASSWORD) {
      setError(true);
      setPassword('');
      return;
    }
    saveUser(name.trim(), email.trim());
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Student Deep Dive Training</h1>
          <p className="text-sm text-gray-500">
            Before you begin, please enter your details so we can track your progress.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@2hourlearning.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {error && <p className="text-xs text-red-500 mt-1">Incorrect password. Try again.</p>}
          </div>
          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || !password}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Start Training
          </button>
        </form>
      </div>
    </div>
  );
}
