import { useState } from "react";
import { verifyLogin } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginModal({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // login | register | forgot

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    const user = verifyLogin(email, password);
    if (!user) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("loggedInEmail", user.email);
    localStorage.setItem("loggedInName", user.name);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user)); // delete password use case

    onSuccess(user.email);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[92%] sm:max-w-sm md:max-w-md animate-scaleIn"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">
          {mode === "login" && "Login Required"}
          {mode === "register" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {/* Email */}
        <input
          type="email"
          autoComplete="username"
          className="border w-full p-2 sm:p-2.5 rounded-md mb-2 text-sm sm:text-base"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password (not in forgot mode) */}
        {mode !== "forgot" && (
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
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
        )}

        {error && (
          <p className="text-red-500 text-xs sm:text-sm text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        {mode === "login" && (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-2 sm:py-2.5 rounded-md mt-3 text-sm sm:text-base"
          >
            Login
          </button>
        )}

        {mode === "register" && (
          <button
            type="button"
            onClick={() =>
              alert("Register flow backend ke baad connect karenge 🙂")
            }
            className="bg-green-600 hover:bg-green-700 transition text-white w-full py-2 sm:py-2.5 rounded-md mt-3 text-sm sm:text-base"
          >
            Register (Coming Soon)
          </button>
        )}

        {mode === "forgot" && (
          <button
            type="button"
            onClick={() =>
              alert("Forgot password flow backend ke baad connect karenge 🙂")
            }
            className="bg-purple-600 hover:bg-purple-700 transition text-white w-full py-2 sm:py-2.5 rounded-md mt-3 text-sm sm:text-base"
          >
            Send Reset Link (Coming Soon)
          </button>
        )}

        {/* Footer links */}
        <div className="mt-3 flex justify-between text-xs sm:text-sm text-blue-600">
          {mode !== "login" ? (
            <button type="button" onClick={() => setMode("login")}>
              ← Back to Login
            </button>
          ) : (
            <>
              <button type="button" onClick={() => setMode("forgot")}>
                Forgot password?
              </button>
              <button type="button" onClick={() => setMode("register")}>
                New user? Register
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
