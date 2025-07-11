import pool from "../../../../lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  const formData = await req.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO public.users (username, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
    [username, email, hashedPassword, "user"]
  );

  return NextResponse.json(
    {
      success: true,
      data: result.rows,
    },
    { status: 201 }
  );
}
