import { useEffect, useState } from "react";
import { saveUserData, loadUserData } from "./data/storage";
import FolderTree from "./Components/FolderTree";
import ContentArea from "./Components/ContentArea";
import LoginModal from "./Components/LoginModal";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function App() {
  const [email, setEmail] = useState(
    () => localStorage.getItem("loggedInEmail") || null
  );

  const [loggedInName, setLoggedInName] = useState(
    () => localStorage.getItem("loggedInName") || ""
  );

  const [folders, setFolders] = useState(() =>
    email ? loadUserData(email) : []
  );

  const [selectedId, setSelectedId] = useState(null);

  const loggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (email) {
      saveUserData(email, folders);
    }
  }, [folders, email]);

  const handleLoginSuccess = (userEmail) => {
    setEmail(userEmail);
    setFolders(loadUserData(userEmail));

    const name = localStorage.getItem("loggedInName") || "";
    setLoggedInName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("loggedInName");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <>
      {!loggedIn && <LoginModal onSuccess={handleLoginSuccess} />}

      {loggedIn && (
        <div className="flex h-screen w-full flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="bg-[#0F1A18] w-full sm:w-[40%] md:w-[30%] lg:w-[20%] h-[35vh] sm:h-full overflow-hidden flex flex-col">
            {/* Folder Tree */}
            <div className="flex-1 overflow-y-auto">
              <FolderTree
                data={folders}
                setData={setFolders}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            </div>

            {/* 🔥 User Info Bottom */}
            <div className="shrink-0 border-t border-white/10 p-3 bg-[#0B1412]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <FaUserCircle className="text-lg text-white" />
                  <span className="text-white text-xs sm:text-sm font-medium max-w-[120px] truncate">
                    {loggedInName || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-white bg-red-600 hover:bg-red-700 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                >
                  <FiLogOut className="text-sm" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#12201E] flex-1 h-full overflow-hidden">
            <ContentArea
              folders={folders}
              setFolders={setFolders}
              selectedId={selectedId}
            />
          </div>
        </div>
      )}
    </>
  );
}
