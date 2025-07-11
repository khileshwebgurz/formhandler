import pool from "../../../../lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {

  const SECRET = process.env.JWT_SECRET || "hello@34#";
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const userResult = await pool.query(
      `SELECT * FROM public.users WHERE username = $1`,
      [username]
    );
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
   return response;
  } catch (error) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
