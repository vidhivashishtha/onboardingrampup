import { useState } from 'react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AdminLogin({ onAuth }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      onAuth();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">Enter the admin password to continue.</p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        {error && <p className="text-xs text-red-500 mt-2">Incorrect password. Try again.</p>}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
