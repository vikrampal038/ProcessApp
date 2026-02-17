import { useState } from "react";
import { verifyLogin } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginModal({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await verifyLogin(email, password);

      if (!res?.success) {
        setError(res?.message || "Invalid email or password");
        return;
      }

      const user = res.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.token);
      localStorage.setItem("isLoggedIn", "true");

      onSuccess(user.email);
    } catch (err) {
      console.error(err);
      setError("Server error, try again");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[92%] sm:max-w-sm md:max-w-md"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">
          Login Required
        </h2>

        <input
          type="email"
          className="border w-full p-2 rounded-md mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            className="border w-full p-2 rounded-md mb-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-3 text-lg"
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-3"
        >
          Login
        </button>
      </form>
    </div>
  );
}
