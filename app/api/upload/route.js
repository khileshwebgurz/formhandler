import { NextResponse } from "next/server";
import formidable from "formidable";
import { Readable } from "stream";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
export const config = {
  api: {
    bodyParser: false,
  },
};
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

function webRequestToNodeRequest(req) {
  const readable = Readable.from(req.body);
  readable.headers = Object.fromEntries(req.headers.entries());
  readable.method = req.method;
  readable.url = req.url;
  return readable;
}

const parseForm = async (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

function flattenFields(obj) {
  const result = {};
  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length === 1) {
      result[key] = obj[key][0];
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

function getFilePath(file, type) {

    const folderMap = {
    image: 'image',
    resume: 'resume',
    video: 'video',
  };

  const subfolder = folderMap[type] || 'other';
  return moveFileToUploadDir(file, UPLOAD_DIR, subfolder);
}

function moveFileToUploadDir(fileInput, baseDir, subfolder = "") {
  const files = Array.isArray(fileInput) ? fileInput : [fileInput];

  const folderPath = path.join(baseDir, subfolder);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const savedPaths = [];

  for (const file of files) {
    if (!file?.filepath) {
      throw new Error('Invalid file: Missing "filepath" property');
    }
    const fileName = `${uuidv4()}-${file.originalFilename}`;
    const destPath = path.join(folderPath, fileName);
    try {
      const sourceContent = fs.readFileSync(file.filepath);

      fs.writeFileSync(destPath, sourceContent);
      fs.unlinkSync(file.filepath);
    } catch (error) {
      console.error(`Error moving file: ${error.message}`);
      throw new Error(`Failed to move file: ${error.message}`);
    }

    const relativePath = `/api/uploads/${subfolder}/${fileName}`;
    savedPaths.push(relativePath);
  }

  // Return a single path if input was a single file, otherwise return array
  return savedPaths.length === 1 ? savedPaths[0] : savedPaths;
}

export async function POST(req) {
  const nodeReq = webRequestToNodeRequest(req);
  const { fields, files } = await parseForm(nodeReq);
  const body = flattenFields(fields);
  let imagePath = getFilePath(files.image, 'image');
  let resumePath = getFilePath(files.resume , 'resume');
  let videoPath = getFilePath(files.video , 'video');

  
  return NextResponse.json({
    success: false,
  });
}
