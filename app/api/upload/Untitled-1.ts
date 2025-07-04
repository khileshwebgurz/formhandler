//app/api/agents/[id]/route.js
import { NextResponse } from "next/server";
import errorMessage from "@/data/errorMessage";
import { query } from "../../db/db";
import { onlyAdmin } from "@/helpers/onlyAdmin";

import path from "path";

import { webRequestToNodeRequest, parseForm, moveFileToUploadDir, flattenFields } from '@/lib/fileMiddleware';
import { adminAndUser } from "@/helpers/adminAndUser";
export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), "uploads/avatars"); // Removed leading slash


export async function GET(req, { params }) {

  const userId = params.id;

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: {
        errCode: errorMessage[1001].code,
        errMessage: errorMessage[1001].message || 'User ID is required',
      },
    }, { status: errorMessage[1001].status });
  }

  try {
    const result = await query(
      `SELECT id, first_name , last_name , email , contact_no , role , address , is_approved, is_active , package_id , created_at , updated_at,
       updated_by, created_by , avatar , last_login
       FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[2002].code,
          errMessage: errorMessage[2002].message || 'User not found',
        },
      }, { status: errorMessage[2002].status });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('GET /users/:id error:', error);
    return NextResponse.json({
      success: false,
      error: {
        errCode: errorMessage[5000].code,
        errMessage: error.message || 'Something went wrong',
      },
    }, { status: errorMessage[5000].status });
  }
}

function getFilePath(existingPath, file) {
  if (existingPath) {
    return existingPath;
  } else if (file) {
    return moveFileToUploadDir(file, UPLOAD_DIR, 'avatars');
  } else {
    return "";
  }
}

export async function PUT(req, { params }) {
  const authResult = await adminAndUser()(req);
  if (authResult) return authResult;

  try {
    const adminId = req.headers.get('adminId');
    const userId = req.headers.get('userId');
    const id = params.id;
    const nodeReq = webRequestToNodeRequest(req);
    const { fields, files } = await parseForm(nodeReq);
    const body = flattenFields(fields);

    const {
      first_name = '',
      last_name = '',
      email = '',
      contact_no = '',
      role = 'User',
      address = '',
      avatar = ''
    } = body;

    let imagePath = null;
    imagePath = getFilePath(avatar, files.avatar);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedContact = contact_no?.trim();
    const trimmedFirstName = first_name.trim();
    const trimmedLastName = last_name.trim();

    if (!id || !trimmedFirstName || !trimmedLastName || !trimmedEmail || !role) {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[1006].code,
          errMessage: errorMessage[1006].message,
        },
      }, { status: errorMessage[1006].status });
    }

    const userExists = await query(`SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL`, [id]);
    if (userExists.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[2002].code,
          errMessage: errorMessage[2002].message || 'User not found',
        },
      }, { status: errorMessage[2002].status });
    }

    if (userId && userId != userExists.rows[0].id) {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[2003].code,
          errMessage: errorMessage[2003].message || 'Access not found',
        },
      }, { status: errorMessage[2003].status });
    }

    const now = new Date();

    await query(
      `UPDATE users SET 
          first_name = $1,
          last_name = $2,
          email = $3,
          contact_no = $4,
          role = $5,
          address = $6,
          is_active = $7,
          updated_by = $8,
          updated_at = $9,
          avatar = $10
        WHERE id = $11`,
      [
        trimmedFirstName, trimmedLastName, trimmedEmail, trimmedContact,
        role, address, false,
        adminId, now, imagePath, id
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'User updated successfully.',
    });

  } catch (error) {
    console.error('Error updating user:', error);

    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[2001].code,
          errMessage: errorMessage[2001].message,
        },
      }, { status: errorMessage[2001].status });
    }

    return NextResponse.json({
      success: false,
      error: {
        errCode: errorMessage[5000].code,
        errMessage: error.message || errorMessage[5000].message,
      },
    }, { status: errorMessage[5000].status });
  }
}



export async function DELETE(req, { params }) {
  const authResult = await adminAndUser()(req);
  if (authResult) return authResult;

  try {
    const adminId = req.headers.get('adminId');
    const userId = req.headers.get('userId');
    const id = params.id;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[1001].code,
          errMessage: errorMessage[1001].message,
        },
      }, { status: errorMessage[1001].status });
    }

    // Check if user exists
    const detail = await query("SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL", [id]);
    if (detail.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[2002].code,
          errMessage: errorMessage[2002].message || 'User not found',
        },
      }, { status: errorMessage[2002].status });
    }

    if (userId && userId != detail.rows[0].id) {
      return NextResponse.json({
        success: false,
        error: {
          errCode: errorMessage[2003].code,
          errMessage: errorMessage[2003].message || 'Access not found',
        },
      }, { status: errorMessage[2003].status });
    }

    const now = new Date();

    await query(
      `UPDATE users SET deleted_at = $1, deleted_by = $2 WHERE id = $3`,
      [now, adminId, id]
    );

    return NextResponse.json({
      success: true,
      message: 'User Archived successfully.',
    });

  } catch (error) {
    console.error('DELETE /users/:id error:', error);
    return NextResponse.json({
      success: false,
      error: {
        errCode: errorMessage[5000].code,
        errMessage: error.message || errorMessage[5000].message,
      },
    }, { status: errorMessage[5000].status });
  }
}
