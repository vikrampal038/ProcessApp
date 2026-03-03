import { useEffect } from "react";

export default function InlineModal({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,        // ✅ new
  onClose,
  onConfirm,
  children,              // ✅ optional content (inputs etc.)
}) {
  // ⌨️ Esc = close, Enter = confirm
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Enter") onConfirm?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onConfirm]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3 sm:px-4"
      onClick={onClose}  // ✅ outside click close
    >
      <div
        className="bg-white p-4 sm:p-5 rounded-xl shadow-xl w-full max-w-[92%] sm:max-w-sm md:max-w-md"
        onClick={(e) => e.stopPropagation()} // prevent close on modal click
      >
        <h3 className="font-bold text-base sm:text-lg">{title}</h3>

        {description && (
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* ✅ Custom content (input, password field, etc.) */}
        {children && <div className="mt-3">{children}</div>}

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 sm:px-4 py-1.5 rounded-md border text-xs sm:text-sm hover:bg-gray-100 transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-3 sm:px-4 py-1.5 rounded-md text-white text-xs sm:text-sm transition disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
