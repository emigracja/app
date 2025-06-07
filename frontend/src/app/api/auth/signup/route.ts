// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
// import { getUserFromDb } from "../auth";
import axios from "@/utils/axios";

async function createUser(userData: {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  try {
    const response = await fetch(`http://backend:8080/users/auth/register`, {
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
    });

    if (!response.ok) {
      console.log(await response.json());
      console.log(
        JSON.stringify({
          password: userData.password,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
        })
      );
      throw new Error(`Rejestracja nie powiodła się`);
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
    console.log("--------------------------------------------");
    console.log(body);
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
      { message: "User created successfully.", userId: newUser.id },
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
