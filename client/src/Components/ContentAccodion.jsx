import { useState } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
  MdDelete,
} from "react-icons/md";
import InlineModal from "./InlineModal";
import AdminPasswordModal from "./AdminPasswordModal";
import { deleteItemById } from "../services/authService";

export default function ContentAccordion({ contents, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [askPassword, setAskPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getExt = (name = "") => {
    const parts = name.split(".");
    return (parts[parts.length - 1] || "").toLowerCase();
  };

  const inferMimeType = (file) => {
    const mime = (file?.mimeType || "").toLowerCase();
    if (mime) return mime;

    const ext = getExt(file?.name || "");
    if (ext === "pdf") return "application/pdf";
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "webp") return "image/webp";
    if (ext === "gif") return "image/gif";
    if (ext === "svg") return "image/svg+xml";
    return "application/octet-stream";
  };

  const withMime = (data, mimeType) => {
    if (!data || typeof data !== "string") return "";

    if (data.startsWith("data:")) {
      const commaIndex = data.indexOf(",");
      if (commaIndex === -1) return data;
      const payload = data.slice(commaIndex + 1);
      return `data:${mimeType};base64,${payload}`;
    }

    return `data:${mimeType};base64,${data}`;
  };

  const getPreviewInfo = (file) => {
    const mimeType = inferMimeType(file);
    const src = withMime(file?.data, mimeType);
    const base64Data = (() => {
      const raw = file?.data || "";
      if (!raw || typeof raw !== "string") return "";
      if (!raw.startsWith("data:")) return raw;
      const commaIndex = raw.indexOf(",");
      return commaIndex === -1 ? "" : raw.slice(commaIndex + 1);
    })();
    const hasPdfSignature = base64Data.startsWith("JVBERi0");
    const isPdfByName = getExt(file?.name || "") === "pdf";
    const isImage = mimeType.startsWith("image/");
    const isPdf = mimeType === "application/pdf" || isPdfByName || hasPdfSignature;
    const pdfSrc = isPdf ? withMime(file?.data, "application/pdf") : src;

    return { src, pdfSrc, mimeType, isImage, isPdf };
  };

  if (!contents.length)
    return (
      <div className="text-sm sm:text-lg md:text-xl font-bold tracking-wider min-h-40 sm:min-h-48 flex items-center justify-center text-white text-center rounded-2xl w-full px-3">
        <span className="bg-zinc-600 border rounded-2xl px-4 py-2 sm:px-6 md:px-10 flex flex-col gap-2">
          <h1>This is a main folder.</h1>
          <h2>Select a subfolder from the left to view or add content.</h2>
        </span>
      </div>
    );

  return (
    <div className="flex mt-10 flex-col justify-center items-center gap-2 sm:gap-3 w-full px-2 sm:px-0">
      {contents.map((c) => (
        <div
          key={c.id}
          className="w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-6xl justify-center items-center"
        >
          <div
            className="w-full cursor-pointer py-2 px-2 sm:py-2 sm:px-2 rounded-lg bg-[#f5f5f5] flex justify-between items-center gap-2"
            onClick={() => setOpenId(openId === c.id ? null : c.id)}
          >
            <strong className="text-sm sm:text-base md:text-lg truncate">
              {c.title}
            </strong>

            <div className="flex items-center gap-2 shrink-0">
              {openId === c.id ? (
                <MdOutlineKeyboardArrowUp className="text-lg sm:text-xl md:text-2xl" />
              ) : (
                <MdOutlineKeyboardArrowDown className="text-lg sm:text-xl md:text-2xl" />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(c.id);
                }}
                className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-100 transition"
              >
                <MdDelete className="text-base sm:text-lg md:text-xl" />
              </button>
            </div>
          </div>

          {openId === c.id && (
            <div className="p-2 sm:p-3 md:p-4 flex flex-col justify-center items-start gap-4 sm:gap-5 w-full">
              <div className="text-white w-full text-sm sm:text-base leading-relaxed">
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                  {c.description
                    ?.split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, index) => (
                      <li key={index} className="leading-6 sm:leading-7 break-words">
                        {line}
                      </li>
                    ))}
                </ul>
              </div>

              {c.file &&
                (() => {
                  const { src, pdfSrc, isImage, isPdf } = getPreviewInfo(c.file);
                  if (!src) return null;

                  if (isImage) {
                    return (
                      <img
                        loading="lazy"
                        src={src}
                        className="w-full max-h-[40vh] sm:max-h-[60vh] md:max-h-[70vh] object-contain rounded-lg border"
                      />
                    );
                  }

                  if (isPdf) {
                    return (
                      <iframe
                        loading="lazy"
                        src={pdfSrc}
                        title="PDF Preview"
                        className="w-full h-[40vh] sm:h-[55vh] md:h-[70vh] rounded-md border bg-white"
                      />
                    );
                  }

                  return (
                    <a
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-300 underline text-sm"
                    >
                      Open attached file
                    </a>
                  );
                })()}
            </div>
          )}
        </div>
      ))}

      {deleteId && !askPassword && (
        <InlineModal
          title="Permanently delete this content?"
          description="This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          danger
          onClose={() => setDeleteId(null)}
          onConfirm={() => setAskPassword(true)}
        />
      )}

      {askPassword && (
        <AdminPasswordModal
          loading={loading}
          onClose={() => {
            setAskPassword(false);
            setDeleteId(null);
          }}
          onConfirm={async (password, setError) => {
            try {
              const token = localStorage.getItem("authToken");
              if (!token) {
                setError("User not logged in");
                return;
              }

              setLoading(true);
              await deleteItemById(token, deleteId, password);

              setError("");
              onDelete(deleteId);
              setAskPassword(false);
              setDeleteId(null);
            } catch (err) {
              setError(err?.response?.data?.message || "Incorrect password");
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </div>
  );
}
