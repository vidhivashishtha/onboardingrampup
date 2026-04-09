// Replace this URL with your Google Apps Script deployment URL
const SHEET_URL = 'https://script.google.com/a/macros/2hourlearning.com/s/AKfycby0z48bTeVP9nDLOeKbJobcpNN9igE_xaCfJNig6fePOM_iWRA2zdkehwPBccIxi2bs/exec';

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
  if (!user || SHEET_URL.startsWith('__')) return; // Skip if no user or URL not configured

  const payload = {
    name: user.name,
    email: user.email,
    stage,
    studentName,
    studentId,
    result,
    attempts: attempts || '',
    feedback: feedback || '',
  };

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail — don't disrupt the user's experience
  }
}
