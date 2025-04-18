// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { getUserFromDb } from "../auth";
import bcrypt from "bcryptjs";

// Replace with your actual user creation logic
async function createUser(userData: {
  email: string;
  username?: string;
  passwordHash: string;
  role?: string;
}) {
  console.log(userData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body; // Add other fields like username if needed

    // --- Input Validation ---
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    // Basic password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }
    // --- End Validation ---

    // --- Check if user already exists ---
    const existingUser = await getUserFromDb(email); // Use your actual DB fetching function
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash Password
    const passwordHash = await bcrypt.hash(password, 10);

    // --- Create User ---
    const newUser = await createUser({
      // Use your actual DB creation function
      email,
      passwordHash,
      role: "USER", // Assign a default role
    });

    // --- Success Response ---
    return NextResponse.json(
      { message: "User created successfully.", userId: newUser.id }, // Or return relevant newUser fields except passwordHash
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    // Generic error for security
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
