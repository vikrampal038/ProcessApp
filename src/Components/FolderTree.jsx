import { useState } from "react";
import FolderNode from "./FolderNode";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import InlineModal from "./InlineModal";
import LogoutPasswordModal from "./LogoutPasswordModal";
import { verifyDeletePassword } from "../services/authService";

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

  const addRootFolder = () => {
    if (!name.trim()) return;

    setData((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), children: [], contents: [] },
    ]);

    setName("");
    setShowInput(false);
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0F1A18] py-3 px-4 border-b border-white/10">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <img src="/process.svg" alt="site logo" className="w-5" />
              <h3 className="text-white font-bold tracking-widest text-sm sm:text-lg">
                ProcessApp
              </h3>
            </div>

            <button
              onClick={() => setShowInput((p) => !p)}
              className="text-white flex items-center gap-2 hover:text-[#2BD4BD]"
            >
              <FaPlus />
              <span className="hidden sm:inline">New Folder</span>
            </button>
          </div>

          {showInput && (
            <div className="mt-2 flex gap-2 border border-white/20 rounded-md p-1">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRootFolder()}
                placeholder="Folder Name"
                className="py-1 px-2 rounded-md w-full outline-0 text-white bg-transparent"
              />

              <div className="flex gap-3 bg-white p-1.5 rounded-md">
                <button onClick={addRootFolder} className="hover:text-green-400">
                  <FaPlus />
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setName("");
                  }}
                  className="hover:text-red-400"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Folder List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
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

        {/* User */}
        <div className="border-t border-white/10 p-3 flex items-center justify-between bg-[#0F1A18]">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-xl text-white" />
            <span className="text-white text-sm font-medium truncate max-w-[120px]">
              {userName || "User"}
            </span>
          </div>

          <button
            onClick={() => setConfirmLogout(true)}
            className="text-red-400 hover:text-red-500"
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      {/* Confirm Logout */}
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

      {/* Ask Password */}
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

            try {
              const res = await verifyDeletePassword({
                email: user.email,
                password,
              });

              if (!res?.success) {
                setError("Incorrect login password");
                return;
              }

              setError("");
              onLogout();
            } catch (err) {
              console.error(err);
              setError("Server error, try again");
            }
          }}
        />
      )}
    </>
  );
}
