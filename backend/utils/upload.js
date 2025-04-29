// backend/utils/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
// Update storage configuration for better organization
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = req.baseUrl.includes('approvals') 
      ? 'feedback' 
      : 'requests';
    cb(null, `public/uploads/${path}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
// In utils/upload.js
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