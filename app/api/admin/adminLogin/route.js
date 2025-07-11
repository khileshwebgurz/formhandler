import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

// using bcrypt for password hashing & salting.
export async function POST(req) {
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const result = await pool.query(
    `INSERT INTO public.admin (username, password)
       VALUES ($1, $2)
       RETURNING *`,
    [username, password]
  );

  console.log("my post request data is >>>", result.rows[0]);

  return NextResponse.json(
    {
      success: true,
    },
    { status: 201 }
  );
}
