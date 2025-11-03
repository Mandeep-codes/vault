// app/signup/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; userId?: string };

      if (res.ok && data.success) {
        router.push("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error", err);
      alert("Signup error — check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
          required
        />

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

        <button type="submit" className="w-full bg-blue-600 py-2 rounded">
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

