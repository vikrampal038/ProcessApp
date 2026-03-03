import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function verifyLogin(email, password) {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data || {};

    if (!token || !user) return null;

    return {
      token,
      email: user.email,
      name: user.name,
      id: user.id,
    };
  } catch {
    return null;
  }
}

export async function verifySession(token) {
  const res = await api.get("/auth/me", withAuth(token));
  return res.data?.user || null;
}

export async function registerUser(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function fetchFolders(token) {
  const res = await api.get("/folders", withAuth(token));
  return res.data || [];
}

export async function createFolder(token, name, parentId = null) {
  const res = await api.post("/folders/create", { name, parentId }, withAuth(token));
  return res.data;
}

export async function createItem(token, payload) {
  const res = await api.post("/items/create", payload, withAuth(token));
  return res.data;
}

export async function fetchItemsByFolder(token, folderId) {
  const res = await api.get(`/items/folder/${folderId}`, withAuth(token));
  return res.data || [];
}

export async function fetchItemsGlobal(token, query = "") {
  const q = String(query || "").trim();
  const path = q ? `/items?q=${encodeURIComponent(q)}` : "/items";
  const res = await api.get(path, withAuth(token));
  return res.data || [];
}

export async function deleteFolderById(token, folderId, deletePassword) {
  const res = await api.delete(`/folders/${folderId}`, {
    ...withAuth(token),
    data: { deletePassword },
  });
  return res.data;
}

export async function deleteItemById(token, itemId, deletePassword) {
  const res = await api.delete(`/items/${itemId}`, {
    ...withAuth(token),
    data: { deletePassword },
  });
  return res.data;
}
