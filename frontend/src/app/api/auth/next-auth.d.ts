// next-auth.d.ts
import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string | null; // This will be the backendToken due to the workaround
            email?: string | null; // Will likely be null initially
            name?: string | null;  // Will likely be null initially
            backendToken?: string;
        } & Omit<DefaultSession['user'], 'email' | 'name' | 'id'>; // Omit to ensure our types take precedence
    }

    // User object returned from authorize()
    interface User extends DefaultUser {
        id: string; // Will be the backendToken
        email?: string | null; // Will be null
        name?: string | null;  // Will be null
        backendToken?: string;
    }
}

declare module 'next-auth/jwt' {
    // Token from jwt() callback
    interface JWT extends DefaultJWT {
        id?: string; // This will be the backendToken (also likely populates 'sub')
        email?: string | null; // Will be null
        name?: string | null;  // Will be null
        backendToken?: string;
    }
}