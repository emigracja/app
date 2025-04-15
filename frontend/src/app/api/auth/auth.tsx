// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { User } from "@/types/users"; // Assuming you have a User type/interface
import { users } from "@/store/data";
import bcrypt from "bcryptjs";

async function getUserFromDb(email: string): Promise<User | null> {
  console.log("Attempting to find user:", email);
  // TODO:
  // Replace this with actual database query
  const user = users.filter((u) => u.email === email);
  if (user.length > 0) {
    return user[0];
  }
  return null;
}

export const config: NextAuthConfig = {
  // Using trustHost is recommended for deployments other than Vercel.
  // trustHost: true, // Consider enabling this based on your deployment environment
  pages: {
    signIn: "/login", // Redirect users to /login if they are not signed in
    // error: '/auth/error', // Optional: Error page
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        // --- !! IMPORTANT !! ---
        // Add validation logic here (e.g., using Zod)
        // TODO
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await getUserFromDb(email); // Fetch user from your DB

        if (!user || !user.passwordHash) {
          console.log("User not found or password missing for:", email);
          return null; // User not found
        }

        // Verify password
        const passwordsMatch = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (passwordsMatch) {
          console.log("Password match for:", email);
          // Return user object without the password
          // This object is then encoded in the JWT or saved in the database session.
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role, // Include role for authorization
          };
        } else {
          console.log("Password mismatch for:", email);
          return null; // Passwords don't match
        }
        // --- !! IMPORTANT !! ---
      },
    }),
    // Add other providers like Google, GitHub etc. here
    // GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
  ],
  callbacks: {
    // The `jwt` callback is invoked when a JWT is created or updated.
    // We add the user's ID and role to the token here.
    async jwt({ token, user }) {
      if (user) {
        // User object is available on initial sign-in
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // The `session` callback is invoked when a session is checked.
    // We add the user's ID and role (from the token) to the session object.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Add role to session
      }
      return session;
    },
    // Use authorized callback to implement authorization logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdminArea = nextUrl.pathname.startsWith("/admin");
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      console.log(isLoggedIn);
      if (!isLoggedIn) {
        return false;
      }

      if (isOnDashboard || isOnAdminArea) {
        if (!isLoggedIn) return false; // Redirect unauthenticated users to login page

        // Example: Role-based authorization for /admin
        if (isOnAdminArea && auth?.user?.role !== "admin") {
          console.log(
            `User ${auth?.user?.email} with role ${auth?.user?.role} tried to access admin area.`
          );
          // Optionally redirect to an 'unauthorized' page or back to dashboard
          return Response.redirect(
            new URL("/dashboard?error=Unauthorized", nextUrl)
          );
          // Or just return false to redirect to login
          // return false;
        }
        // Allow access if logged in and meets role requirements (if any)
        return true;
      } else if (isLoggedIn && isOnLoginPage) {
        // If user is logged in and tries to access login page, redirect them away
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Allow access to all other pages (public pages, login page for non-logged-in users) by default
      return true;
    },
  },
  // If using JWT strategy (default), the session object is derived from the JWT token
  session: { strategy: "jwt" }, // Explicitly set strategy (though JWT is default)
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
