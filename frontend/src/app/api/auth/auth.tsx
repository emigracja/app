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
  // trustHost: true,
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
        // Add validation logic here
        // TODO
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

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

        if (passwordsMatch) {
          // This object is then encoded in the JWT or saved in the database session.
          return {
            id: user.id,
            username: user.username,
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
      }
      return token;
    },
    // The `session` callback is invoked when a session is checked.
    // We add the user's ID and role (from the token) to the session object.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // Use authorized callback to implement authorization logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      console.log(isLoggedIn);
      if (!isLoggedIn) {
        return false;
      }
      return true;
    },
  },
  // If using JWT strategy (default), the session object is derived from the JWT token
  session: { strategy: "jwt" },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
