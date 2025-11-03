// app/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { success?: boolean; token?: string; message?: string; userId?: string };

      if (res.ok && data.success && data.token) {
        // store token (demo: localStorage). In production use httpOnly cookie.
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", String(data.userId ?? ""));
        router.push("/vault");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error", err);
      alert("Login error — check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Log In</h2>

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
          required
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          required
        />

        <button type="submit" className="w-full bg-green-600 py-2 rounded">
          {loading ? "Signing in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

