import path from "path";
import fs from "fs";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";


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

function moveFileToUploadDir(fileInput,UPLOAD_DIR,dir,subfolder = "" ) {
  const files = Array.isArray(fileInput) ? fileInput : [fileInput];

  const folderPath = path.join(UPLOAD_DIR, subfolder);
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

   const relativePath = `/api/uploads/${dir}/${
      subfolder ? subfolder + "/" : ""
    }${fileName}`;
    savedPaths.push(relativePath);
  }

  // Return a single path if input was a single file, otherwise return array
  return savedPaths[0];
}

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

export {
  webRequestToNodeRequest,
  parseForm,
  moveFileToUploadDir,
  flattenFields,
};