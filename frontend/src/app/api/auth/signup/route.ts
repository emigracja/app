// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { getUserFromDb } from "../auth";

async function createUser(userData: {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/users/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: userData.password,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Rejestracja nie powiodła się: ${response.status}`);
    }

    const result = await response.json();
    console.log("SIGN IN RESULT");
    console.log(result);
    return result;
  } catch (err) {
    console.error("Błąd podczas rejestracji:", err);
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

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
    const existingUser = await getUserFromDb(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // --- Create User ---
    const newUser = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
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
