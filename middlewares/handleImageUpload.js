const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'file-storage');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// eslint-disable-next-line consistent-return
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }

  const err = `Error: File upload only support the following filetypes - ${filetypes}`;
  console.error(err);
  cb(err);
};

const upload = multer({ storage, fileFilter }).single('main_picture');

module.exports = upload;
