import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedUsername = form.username.trim();

    // Client-side validation
    if (!trimmedUsername) {
      setError("Username is required");
      setLoading(false);
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        username: trimmedUsername,
        password: form.password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser({ username: res.data.username || trimmedUsername, token: res.data.token });
      } else {
        setError(res.data.error || "Operation failed");
      }
    } catch (err) {
      const backendError = err.response?.data?.error;
      setError(backendError || "Network error. Please try again.");
      
      // Optional: Remove console.error in production
      console.log("Auth attempt failed:", backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (6+ chars, 1 letter, 1 number)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "New user? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        {!isLogin && (
          <p className="text-xs text-center text-gray-500 mt-4">
            Password must contain at least 1 letter and 1 number
          </p>
        )}
      </div>
    </div>
  );
}