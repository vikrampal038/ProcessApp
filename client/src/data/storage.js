
export function saveUserData(email, data) {
  if (!email) return;
  localStorage.setItem(`folders_${email}`, JSON.stringify(data));
}

export function loadUserData(email) {
  if (!email) return [];
  const raw = localStorage.getItem(`folders_${email}`);
  return raw ? JSON.parse(raw) : [];
}
