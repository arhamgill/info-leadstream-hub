"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("adminLoggedIn", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-6">
      <div className="bg-[#0f172a] rounded-xl p-8 shadow-2xl border border-gray-800 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Admin Login
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-base hover:bg-[#00b8e6] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
