import { useEffect, useState } from "react";
import { saveUserData, loadUserData } from "./data/storage";
import FolderTree from "./Components/FolderTree";
import ContentArea from "./Components/ContentArea";
import LoginModal from "./Components/LoginModal";
import Navbar from "./Components/Navbar";

export default function App() {
  const [email, setEmail] = useState(
    () => localStorage.getItem("loggedInEmail") || null,
  );

  const [folders, setFolders] = useState(() =>
    email ? loadUserData(email) : [],
  );

  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  const [loggedInName, setLoggedInName] = useState(
    localStorage.getItem("loggedInName"),
  );

  const loggedIn = isLoggedIn;

  useEffect(() => {
    if (email) saveUserData(email, folders);
  }, [folders, email]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("loggedInName");
    localStorage.removeItem("isLoggedIn");

    setEmail(null);
    setFolders([]);
    setSelectedId(null);
    setIsLoggedIn(false);
    setLoggedInName(null);
  };

  return (
    <>
      {!loggedIn && (
        <LoginModal
          onSuccess={(email, name) => {
            localStorage.setItem("loggedInEmail", email);
            localStorage.setItem("loggedInName", name);
            localStorage.setItem("isLoggedIn", "true");

            setEmail(email);
            setLoggedInName(name);
            setIsLoggedIn(true);
          }}
        />
      )}

      {loggedIn && (
        <div className="flex h-screen w-full flex-col sm:flex-row">
          <div className="bg-[#0F1A18] w-full sm:w-[40%] md:w-[30%] lg:w-[20%] h-[35vh] sm:h-full overflow-y-auto">
            <FolderTree
              data={folders}
              setData={setFolders}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              userName={loggedInName}
              onLogout={handleLogout}
            />
          </div>

          <div className="bg-[#12201E] flex-1 h-full overflow-hidden flex flex-col">
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
