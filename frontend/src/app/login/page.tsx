"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader/Loader";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = "/wallet";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setIsLoading(false);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        setError("Invalid email or password.");
      } else if (result?.ok) {
        console.log("Sign in successful, redirecting to:", callbackUrl);
        router.push('/wallet');
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Caught exception during sign in:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
      <section className="relative block w-full h-full max-w-md mx-auto text-white rounded-xl p-6 sm:p-8 shadow-lg">
        {isLoading && (
            <div className="fixed left-0 top-0 bg-black/50 flex items-center justify-center z-20 w-full h-full">
              <Loader />
            </div>
        )}
        <form
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-col gap-5"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium opacity-80">
              Email Address
            </label>
            <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
                placeholder="you@example.com"
                disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium opacity-80">
              Password
            </label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
                placeholder="••••••••"
                disabled={isLoading}
            />
          </div>

          {error && (
              <p className="text-sm text-red-400 text-center font-medium mt-2">
                {error}
              </p>
          )}

          <button
              type="submit"
              disabled={isLoading}
              className={`
            mt-4 px-4 py-2 rounded-md font-semibold transition duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800/70
            ${
                  isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
              }
          `}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          <div className="text-center mt-3">
            <a
                href="/signup"
                className="text-sm text-blue-400 hover:text-blue-300 opacity-80 hover:opacity-100 transition"
            >
              Sign Up
            </a>
          </div>
        </form>
      </section>
  );
}