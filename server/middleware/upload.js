const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'campusconnect/general';
    let resource_type = 'auto';

    if (req.baseUrl.includes('lostfound')) folder = 'campusconnect/lostfound';
    else if (req.baseUrl.includes('events')) folder = 'campusconnect/events';
    else if (req.baseUrl.includes('materials')) folder = 'campusconnect/materials';

    return {
      folder,
      resource_type,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      transformation: file.mimetype.startsWith('image/')
        ? [{ width: 1200, quality: 'auto', fetch_format: 'auto' }]
        : [],
    };
  },
});

// File filter — only allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
