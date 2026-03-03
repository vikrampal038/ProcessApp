import { useState } from "react";
import { registerUser, verifyLogin } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginModal({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showDeletePass, setShowDeletePass] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetMessages();
    setPassword("");
    setDeletePassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const user = await verifyLogin(email.trim(), password);
      if (!user) {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("loggedInEmail", user.email);
      localStorage.setItem("loggedInName", user.name);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", user.token);
      localStorage.setItem("user", JSON.stringify(user));

      onSuccess(user.email, user.name, user.token);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!name.trim() || !email.trim() || !password.trim() || !deletePassword.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        deletePassword,
      });
      setMessage("Registration successful. Please login.");
      setMode("login");
      setPassword("");
      setDeletePassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-4">
      <form
        onSubmit={mode === "login" ? handleLogin : handleRegister}
        className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[92%] sm:max-w-sm md:max-w-md animate-scaleIn"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">
          {mode === "login" ? "Login Required" : "Create Account"}
        </h2>

        {mode === "register" && (
          <input
            type="text"
            className="border w-full p-2 sm:p-2.5 rounded-md mb-2 text-sm sm:text-base"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          autoComplete="username"
          className="border w-full p-2 sm:p-2.5 rounded-md mb-2 text-sm sm:text-base"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="border w-full p-2 sm:p-2.5 rounded-md mb-2 text-sm sm:text-base"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-3.5 text-xl text-black"
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {mode === "register" && (
          <div className="relative">
            <input
              type={showDeletePass ? "text" : "password"}
              autoComplete="new-password"
              className="border w-full p-2 sm:p-2.5 rounded-md mb-2 text-sm sm:text-base"
              placeholder="Delete Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowDeletePass((p) => !p)}
              className="absolute right-3 top-3.5 text-xl text-black"
            >
              {showDeletePass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>}
        {message && <p className="text-green-600 text-xs sm:text-sm text-center">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`transition text-white w-full py-2 sm:py-2.5 rounded-md mt-3 text-sm sm:text-base ${
            mode === "login" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          } disabled:opacity-60`}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <div className="mt-3 flex justify-between text-xs sm:text-sm text-blue-600">
          {mode === "login" ? (
            <button type="button" onClick={() => switchMode("register")}>
              New user? Register
            </button>
          ) : (
            <button type="button" onClick={() => switchMode("login")}>
              Back to Login
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
