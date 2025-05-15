// backend/utils/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadsDir = path.join(__dirname, '../public/uploads');

// Ensure uploads directories exist
if (!fs.existsSync(baseUploadsDir)) {
  fs.mkdirSync(baseUploadsDir, { recursive: true });
}
if (!fs.existsSync(path.join(baseUploadsDir, 'feedback'))) {
  fs.mkdirSync(path.join(baseUploadsDir, 'feedback'), { recursive: true });
}
if (!fs.existsSync(path.join(baseUploadsDir, 'requests'))) {
  fs.mkdirSync(path.join(baseUploadsDir, 'requests'), { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.baseUrl.includes('approvals') 
      ? path.join(baseUploadsDir, 'feedback')
      : path.join(baseUploadsDir, 'requests');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Store just the filename with extension
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image or doc files are allowed!'), false);
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Limit number of files
  },
  fieldNameSize: 200
});
export default upload;