import axios from "axios";

const API = "http://localhost:5000/api/auth";

export async function registerUser(data) {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
}

export async function loginUser(data) {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
}

// ✅ Add this function (used in LoginModal + FolderTree logout verify)
export async function verifyLogin(email, password) {
  const res = await axios.post(`${API}/login`, { email, password });
  return res.data; // { success, user, token } expected
}

export async function verifyDeletePassword(data) {
  const res = await axios.post(`${API}/verify-delete-password`, data);
  return res.data; // { success: true/false }
}
