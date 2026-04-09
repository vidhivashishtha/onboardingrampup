import { supabase } from './supabase';

const USER_KEY = 'rampup_user';

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(name, email) {
  const user = { name, email };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function logToSheet({ stage, studentName, studentId, result, attempts, feedback }) {
  const user = getUser();
  if (!user || !supabase) return;

  try {
    await supabase.from('progress_log').insert({
      user_name: user.name,
      user_email: user.email,
      stage,
      student_name: studentName || '',
      student_id: studentId || '',
      result: result || '',
      attempts: attempts || null,
      feedback: feedback || '',
    });
  } catch {
    // Silently fail — don't disrupt the user's experience
  }
}
