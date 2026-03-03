import { useState } from "react";
import FolderNode from "./FolderNode";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import InlineModal from "./InlineModal";
import LogoutPasswordModal from "./LogoutPasswordModal";
import { createFolder, verifyLogin } from "../services/authService";
import logo from "../../public/process.svg"

export default function FolderTree({
  data = [],
  setData,
  selectedId,
  setSelectedId,
  userName,
  onLogout,
}) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [askLogoutPassword, setAskLogoutPassword] = useState(false);

  const addRootFolder = async () => {
    if (!name.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const created = await createFolder(token, name.trim(), null);

      setData((prev) => [
        ...prev,
        {
          id: created._id,
          name: created.name,
          parentId: null,
          children: [],
          contents: [],
        },
      ]);
    } catch (err) {
      console.error("Create folder failed", err);
    }

    setName("");
    setShowInput(false);
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#0F1A18] py-3 sm:py-4 px-3 sm:px-4 border-b border-white/10">
          <div className="flex justify-between items-center gap-2">
            <div className="min-w-0 flex justify-start items-center gap-2">
              <img src={logo} alt="site logo" className="w-5 shrink-0" />
              <h3 className="text-white font-bold tracking-wide text-sm md:text-base xl:text-lg font-sans truncate">
                ProcessApp
              </h3>
            </div>

            <button
              onClick={() => setShowInput((p) => !p)}
              aria-label="Add folder"
              title="Add folder"
              className="h-8 w-8 shrink-0 grid place-items-center rounded-md text-white hover:bg-white/10 hover:text-[#2BD4BD] transition"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>

          {showInput && (
            <div className="mt-2 flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center border border-white/20 rounded-md p-1">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRootFolder()}
                placeholder="Folder Name"
                className="py-1 px-2 rounded-md text-xs sm:text-sm w-full outline-0 text-white bg-transparent"
              />

              <div className="flex justify-end sm:justify-center items-center gap-3 bg-white p-1.5 rounded-md sm:rounded-r-sm">
                <button
                  onClick={addRootFolder}
                  className="hover:text-green-400 text-base sm:text-lg"
                >
                  <FaPlus />
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setName("");
                  }}
                  className="hover:text-red-400 text-base sm:text-lg"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Folder List */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-3 lg:px-4 py-2 sm:py-3 space-y-1.5 sm:space-y-2">
          {data.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              setData={setData}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
        </div>

        {/* Bottom User Profile */}
        <div className="border-t border-white/10 p-3 flex items-center justify-between bg-[#0F1A18]">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-xl text-white" />
            <span className="text-white text-sm font-medium truncate max-w-[120px]">
              {userName || "User"}
            </span>
          </div>

          <button
            onClick={() => setConfirmLogout(true)}
            className="text-red-400 hover:text-red-500 transition"
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      {confirmLogout && !askLogoutPassword && (
        <InlineModal
          title="⚠️ Are you sure you want to logout?"
          description="You will need to login again to access your data."
          confirmText="Yes, Logout"
          cancelText="Cancel"
          danger
          onClose={() => setConfirmLogout(false)}
          onConfirm={() => setAskLogoutPassword(true)}
        />
      )}

      {askLogoutPassword && (
        <LogoutPasswordModal
          onClose={() => {
            setAskLogoutPassword(false);
            setConfirmLogout(false);
          }}
          onConfirm={async (password, setError) => {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user?.email) {
              setError("User not logged in");
              return;
            }

            const ok = await verifyLogin(user.email, password);

            if (!ok) {
              setError("Incorrect login password");
              return;
            }

            setError("");
            onLogout();
          }}
        />
      )}
    </>
  );
}
