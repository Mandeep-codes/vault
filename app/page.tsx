"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to SmartVault 🔐</h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Securely store and manage your passwords, notes, and sensitive information.
      </p>

      <div className="flex gap-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg"
          onClick={() => router.push("/login")}
        >
          Log In
        </Button>
      </div>
    </div>
  );
}




