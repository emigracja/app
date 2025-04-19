// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { User } from "@/types/users";
import { users } from "@/store/data";
import bcrypt from "bcryptjs";

export async function getUserFromDb(email: string): Promise<User | null> {
  // TODO:
  // Replace this with actual database query
  const user = users.filter((u) => u.email === email);
  if (user.length > 0) {
    return user[0];
  }

  return null;
}

export const config: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login", // Redirect users to /login if they are not signed in
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
        // Using 'any' here as User type might conflict before extensions are fully processed by TS
        // TODO
        // Add validation logic here
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const response = await fetch(
            `${process.env.BACKEND_API_URL}/users/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            }
          );

          if (!response.ok) {
            console.error(`Backend login failed: ${response.status}`);
            return null;
          }
          const data = await response.json();
          // TODO
          // adjust to working backend auth
          const backendToken = data.token;
          const backendUser = data.user;
          if (!backendToken) {
            console.error("Backend response missing token");
            return null;
          }
          let userId = backendUser?.id;
          let userEmail = backendUser?.email;
          let userRole = backendUser?.role;
        } catch (err) {
          console.log("Backend login error: ", err);
        }

        const user = await getUserFromDb(email);

        if (!user || !user.passwordHash) {
          console.log("User not found or password missing for:", email);
          return null;
        }

        // Verify password
        const passwordsMatch = await bcrypt.compare(
          password,
          user.passwordHash
        );

        // TODO
        // Verify password on backend
        let isLoggedIn = false;
        let backendToken;
        try {
          const response = await fetch(
            `${process.env.BACKEND_API_URL}/users/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          if (response.ok) {
            isLoggedIn = true;
            const { token } = await response.json();
            backendToken = token;
          }
        } catch (err) {
          console.log("Login attemp failed. error:", err);
          isLoggedIn = false;
        }

        // change passwordsMatch to isLoggedIn when backend auth will work
        if (passwordsMatch) {
          // This object is then encoded in the JWT
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } else {
          console.log("Password mismatch for:", email);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // The `jwt` callback is invoked when a JWT is created or updated.
    // We add the user's ID and role to the token here.
    async jwt({ token, user }) {
      if (user) {
        // User object is available on initial sign-in
        token.id = user.id;
        token.role = user.role;
        token.backendToken = user.backendToken;
      }
      return token;
    },
    // The `session` callback is invoked when a session is checked.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.backendToken = token.backendToken as string;
      }
      return session;
    },
    // Use authorized callback to implement authorization logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnSignupPage = nextUrl.pathname.startsWith("/signup");
      if (isOnSignupPage) {
        return true;
      }
      if (!isLoggedIn) {
        return false;
      }
      return true;
    },
  },
  // the session object is derived from the JWT token
  session: { strategy: "jwt" },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
