import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LogoutPasswordModal({ onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Password required");
      return;
    }

    onConfirm(password, setError);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 px-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl shadow-2xl w-full max-w-sm"
      >
        <h3 className="font-bold text-lg">Confirm Logout</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter your login password to logout.
        </p>

        <div className="relative mt-4">
          <input
            autoFocus
            type={showPass ? "text" : "password"}
            className="border w-full p-2 rounded-md outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Enter login password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
          />

          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-2.5 text-xl text-black"
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

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
            Verify & Logout
          </button>
        </div>
      </form>
    </div>
  );
}
