import pool from "../../../lib/db";
export async function GET(req) {
  try {
    const result = await pool.query(`SELECT * from "user"`);
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error executing query", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
