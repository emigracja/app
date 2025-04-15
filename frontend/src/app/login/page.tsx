"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"; // Use next/navigation for App Router

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get callback URL from query parameters, default to dashboard
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const loginError = searchParams.get("error"); // Get error from URL (e.g., from middleware redirect)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false, // Important: Handle redirect manually
        email,
        password,
        // callbackUrl is automatically picked up by signIn, but can be specified
      });

      setIsLoading(false);

      if (result?.error) {
        // Handle specific errors or show a generic message
        console.error("Sign in error:", result.error);
        // Map common errors or use the error message directly (be careful with sensitive info)
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else if (result?.ok) {
        // Sign-in successful, redirect to the originally intended page or dashboard
        router.push(callbackUrl);
        router.refresh(); // Optional: Refresh server components after login
      } else {
        // Handle cases where result is null/undefined or ok is false without error
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Caught exception during sign in:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Display login error from URL redirect (e.g., unauthorized access attempt) */}
        {loginError && !error && (
          <p style={styles.error}>
            {
              loginError === "CredentialsSignin"
                ? "Login failed from previous attempt."
                : loginError === "Callback"
                ? "There was an issue during login callback."
                : "You need to be logged in to view that page." // Default message or map specific errors
            }
          </p>
        )}
        {/* Display error from this login attempt */}
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// Basic inline styles (replace with your preferred styling solution)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontWeight: "bold" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "4px" },
  button: {
    padding: "10px 15px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: { color: "red", marginBottom: "10px" },
};
