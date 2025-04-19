"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"; // Use next/navigation for App Router

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/news";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors returned from the API
        setError(data.message || "Registration failed. Please try again.");
      } else {
        // --- Registration Successful ---

        // Automatically log the user in
        const signInResult = await signIn("credentials", {
          redirect: false, // Don't redirect automatically from signIn
          email,
          password,
        });

        if (signInResult?.error) {
          // Handle sign-in error after successful registration
          console.error(
            "Sign-in after registration failed:",
            signInResult.error
          );
          setError(
            "Registration successful, but auto-login failed. Please log in manually."
          );
        } else if (signInResult?.ok) {
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setError("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative block w-full h-full max-w-md mx-auto text-white rounded-xl p-6 sm:p-8 shadow-lg">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        {/* Email Input Group */}
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

        {/* Password Input Group */}
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

        {/* Confirm Password Input Group */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium opacity-80"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {/* First Name Input Group */}
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className="text-sm font-medium opacity-80">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            placeholder="John"
            disabled={isLoading}
          />
        </div>

        {/* Last Name Input Group */}
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-sm font-medium opacity-80">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            placeholder="Doe"
            disabled={isLoading}
          />
        </div>

        {/* Phone Number Input Group */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="phoneNumber"
            className="text-sm font-medium opacity-80"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
            placeholder="+1 123 456 7890"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center font-medium mt-2">
            {error}
          </p>
        )}

        {/* Submit Button */}
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
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </section>
  );
}
