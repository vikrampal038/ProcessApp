import { useState } from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FcOpenedFolder } from "react-icons/fc";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import InlineModal from "./InlineModal";
import AdminPasswordModal from "./AdminPasswordModal";
import { createFolder, deleteFolderById } from "../services/authService";

export default function FolderNode({
  folder,
  setData,
  selectedId,
  setSelectedId,
}) {
  const [open, setOpen] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [askPassword, setAskPassword] = useState(false);

  const addSubFolder = async () => {
    if (!newName.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const created = await createFolder(token, newName.trim(), folder.id);

      setData((prev) => {
        const addToTree = (items) =>
          items.map((item) => {
            if (item.id === folder.id) {
              return {
                ...item,
                children: [
                  ...(item.children || []),
                  {
                    id: created._id,
                    name: created.name,
                    parentId: folder.id,
                    children: [],
                    contents: [],
                  },
                ],
              };
            }
            if (item.children?.length) {
              return { ...item, children: addToTree(item.children) };
            }
            return item;
          });

        return addToTree(prev);
      });
    } catch (err) {
      console.error("Create subfolder failed", err);
    }

    setNewName("");
    setShowInput(false);
  };

  const deleteFolder = () => {
    setData((prev) => {
      const removeFromTree = (items) =>
        items
          .filter((item) => item.id !== folder.id)
          .map((item) => ({
            ...item,
            children: item.children ? removeFromTree(item.children) : [],
          }));

      return removeFromTree(prev);
    });

    setConfirmDelete(false);
    setAskPassword(false);
  };

  return (
    <div className="w-full relative">
      <div
        className={`flex items-center justify-between gap-1.5 sm:gap-2 rounded-md px-2 py-1.5 hover:bg-white/5 ${
          selectedId === folder.id ? "bg-white/10" : ""
        }`}
      >
        <span
          onClick={() => setOpen(!open)}
          className="cursor-pointer text-white shrink-0"
        >
          {folder.children?.length ? (
            open ? (
              <MdOutlineKeyboardArrowDown size={18} />
            ) : (
              <MdOutlineKeyboardArrowRight size={18} />
            )
          ) : (
            <span className="w-4.5 inline-block" />
          )}
        </span>

        <span
          onClick={() => setSelectedId(folder.id)}
          className="flex items-center gap-1.5 text-white cursor-pointer flex-1 min-w-0 truncate"
        >
          <FcOpenedFolder />
          <span className="truncate">{folder.name}</span>
        </span>

        <span className="flex items-center gap-2 sm:gap-3 text-white shrink-0">
          <button
            onClick={() => {
              setShowInput(true);
              setConfirmDelete(false);
              setAskPassword(false);
            }}
            className="hover:text-[#5bd68e]"
          >
            <FaPlus />
          </button>

          <button
            onClick={() => {
              setConfirmDelete(true);
              setShowInput(false);
            }}
            className="hover:text-red-400"
          >
            <MdDelete />
          </button>
        </span>
      </div>

      {showInput && (
        <div className="ml-4 sm:ml-6 mt-1 flex gap-2 border border-white/20 rounded-md p-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSubFolder()}
            placeholder="New folder name"
            className="py-1 px-2 rounded-md w-full outline-0 text-white bg-transparent"
          />
          <button onClick={addSubFolder} className="hover:text-green-400">
            <FaPlus />
          </button>
        </div>
      )}

      {confirmDelete && !askPassword && (
        <InlineModal
          title="Permanently delete this folder?"
          description="All subfolders and contents will be deleted."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          danger
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => setAskPassword(true)}
        />
      )}

      {askPassword && (
        <AdminPasswordModal
          onClose={() => {
            setAskPassword(false);
            setConfirmDelete(false);
          }}
          onConfirm={async (password, setError) => {
            try {
              const token = localStorage.getItem("authToken");
              if (!token) {
                setError("User not logged in");
                return;
              }

              await deleteFolderById(token, folder.id, password);
              setError("");
              deleteFolder();
            } catch (err) {
              setError(err?.response?.data?.message || "Incorrect password");
            }
          }}
        />
      )}

      {open && folder.children?.length > 0 && (
        <div className="ml-3 sm:ml-4 mt-1 space-y-1">
          {folder.children.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              setData={setData}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
