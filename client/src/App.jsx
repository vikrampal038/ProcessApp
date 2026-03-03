import { useEffect, useState } from "react";
import { fetchFolders, verifySession } from "./services/authService";
import FolderTree from "./Components/FolderTree";
import ContentArea from "./Components/ContentArea";
import LoginModal from "./Components/LoginModal";
import Navbar from "./Components/Navbar";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [email, setEmail] = useState(() =>
    token ? localStorage.getItem("loggedInEmail") || null : null,
  );

  const [folders, setFolders] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(token));

  const [loggedInName, setLoggedInName] = useState(
    token ? localStorage.getItem("loggedInName") : null,
  );

  const loggedIn = isLoggedIn;

  const buildFolderTree = (apiFolders) => {
    const map = new Map();
    const toId = (value) => (value ? String(value) : null);

    apiFolders.forEach((folder) => {
      const id = toId(folder._id);
      map.set(id, {
        id,
        name: folder.name,
        parentId: toId(folder.parent),
        children: [],
        contents: [],
      });
    });

    const roots = [];

    apiFolders.forEach((folder) => {
      const id = toId(folder._id);
      const current = map.get(id);
      const parentId = toId(folder.parent);

      if (parentId && map.has(parentId)) {
        map.get(parentId).children.push(current);
      } else {
        roots.push(current);
      }
    });

    return roots;
  };

  useEffect(() => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("folders_"))
      .forEach((key) => localStorage.removeItem(key));
  }, []);

  useEffect(() => {
    const validateSession = async () => {
      if (!token) return;

      try {
        const activeUser = await verifySession(token);
        if (!activeUser) throw new Error("Session invalid");

        localStorage.setItem("loggedInEmail", activeUser.email);
        localStorage.setItem("loggedInName", activeUser.name);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...(JSON.parse(localStorage.getItem("user") || "{}")),
            email: activeUser.email,
            name: activeUser.name,
            id: activeUser.id,
          })
        );
      } catch {
        localStorage.removeItem("loggedInEmail");
        localStorage.removeItem("loggedInName");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        setEmail(null);
        setFolders([]);
        setSelectedId(null);
        setIsLoggedIn(false);
        setLoggedInName(null);
        setToken(null);
      }
    };

    validateSession();
  }, [token]);

  useEffect(() => {
    const loadFolders = async () => {
      if (!loggedIn || !token) return;

      try {
        const apiFolders = await fetchFolders(token);
        setFolders(buildFolderTree(apiFolders));
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("loggedInEmail");
          localStorage.removeItem("loggedInName");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");

          setEmail(null);
          setFolders([]);
          setSelectedId(null);
          setIsLoggedIn(false);
          setLoggedInName(null);
          setToken(null);
          return;
        }

        console.error("Failed to fetch folders", err);
      }
    };

    loadFolders();
  }, [loggedIn, token]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("loggedInName");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setEmail(null);
    setFolders([]);
    setSelectedId(null);
    setIsLoggedIn(false);
    setLoggedInName(null);
    setToken(null);
  };

  return (
    <>
      {!loggedIn && (
        <LoginModal
          onSuccess={(email, name, token) => {
            localStorage.setItem("loggedInEmail", email);
            localStorage.setItem("loggedInName", name);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("authToken", token);

            setEmail(email);
            setLoggedInName(name);
            setIsLoggedIn(true);
            setToken(token);
          }}
        />
      )}

      {loggedIn && (
        <div className="flex h-dvh min-h-screen w-full flex-col md:flex-row">
          <div className="bg-[#0F1A18] w-full h-[38vh] overflow-y-auto border-b border-white/10 md:h-dvh md:w-[34%] lg:w-[28%] xl:w-[22%] 2xl:w-[20%] md:min-w-[260px] lg:min-w-[280px] md:max-w-[360px] md:border-b-0 md:border-r">
            <FolderTree
              data={folders}
              setData={setFolders}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              userName={loggedInName}
              onLogout={handleLogout}
            />
          </div>

          <div className="bg-[#12201E] flex-1 h-full min-h-0 overflow-hidden flex flex-col">
            <Navbar
              search={search}
              setSearch={setSearch}
              showAdd={showAdd}
              setShowAdd={setShowAdd}
              selectedId={selectedId}
            />

            <ContentArea
              folders={folders}
              setFolders={setFolders}
              selectedId={selectedId}
              search={search}
              showAdd={showAdd}
              setShowAdd={setShowAdd}
            />
          </div>
        </div>
      )}
    </>
  );
}
