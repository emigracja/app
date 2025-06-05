// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig, User as NextAuthUser } from "next-auth";

export const config: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
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
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          console.log("Attempting backend login for:", email);
          console.log(`${process.env.BACKEND_URL}/users/auth/login`)
          const response = await fetch(
              `${process.env.BACKEND_URL}/users/auth/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              }
          );

          if (response.ok) {
            const backendAuthResponse = await response.json(); // Expects { token: "string" }
            console.log("Backend login successful:", backendAuthResponse.data);

            if (!backendAuthResponse.data.token) {
              console.error("Backend response is missing token");
              return null;
            }

            const backendToken = backendAuthResponse.data.token as string;

            console.log(backendToken)

            return {
              id: backendToken,
              email: null,
              name: null,
            };

          } else {
            const errorData = await response.json().catch(() => ({ message: "Unknown error from backend" }));
            console.error(
                "Backend login failed:",
                response.status,
                response.statusText,
                errorData
            );
            return null;
          }
        } catch (err) {
          console.error("Error during backend login request:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {

        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        if (user .backendToken) {
          token.backendToken = (user ).backendToken as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {

        session.user.id = token.id as string;
        session.user.email = token.email as string | null;
        session.user.name = token.name as string | null;
        // Make the backendToken available in the session
        if (token.backendToken) {
          session.user.backendToken = token.backendToken as string;
        }
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      const isOnSignupPage = nextUrl.pathname.startsWith("/signup");

      if (isOnLoginPage || isOnSignupPage) {
        return true;
      }

      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
  },
  session: { strategy: "jwt" },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);