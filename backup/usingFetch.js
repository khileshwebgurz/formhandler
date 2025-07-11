import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {

    // have to use formData here too 
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  console.log("my post request data is >>>", { username, password });

  return NextResponse.json(
    {
      success: true,
    },
    { status: 201 }
  );
}
