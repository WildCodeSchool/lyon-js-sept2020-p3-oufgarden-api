const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'file-storage');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  if (mimetype && extname) {
    return cb(null, true);
  }
  const err = `Error: file upload only support the following filetypes: ${fileTypes}`;
  console.error(err);
  cb(err);
  return null;
};

const mainUploadImage = multer({ storage, fileFilter }).single('picture');
module.exports = mainUploadImage;
