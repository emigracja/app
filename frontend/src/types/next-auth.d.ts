import NextAuth from "next-auth";
import { User as AppUser } from "./users";

declare module "next-auth" {
  interface User extends AppUser {}

  interface Session {
    user: AppUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
