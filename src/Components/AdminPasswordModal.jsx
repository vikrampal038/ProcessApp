import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { verifyDeletePassword } from "../services/authService";

export default function AdminPasswordModal({ onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPassword("");
    setError("");
    setShowPass(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Password required");
      return;
    }

    // 👇 Parent component handle karega verification (abhi mock, future API)
    onConfirm(password, setError);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 px-3 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md"
      >
        <h3 className="font-bold text-base sm:text-lg md:text-xl">
          Delete Password Required
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
          Please enter your delete password to continue.
        </p>

        <div className="relative mt-3">
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={JSON.parse(localStorage.getItem("user"))?.email || ""}
            readOnly
            className="hidden"
          />

          <input
            autoFocus
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            className="border w-full p-2 sm:p-2.5 rounded-md mt-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            placeholder="Enter delete password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
          />

          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-6 text-xl text-black"
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-xs sm:text-sm mt-1">{error}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm"
          >
            Verify & Delete
          </button>
        </div>
      </form>
    </div>
  );
}
