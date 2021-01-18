const multer = require('multer');
const storage = require('./handleGardenImageUpload');
const fileFilter = require('./handleGardenImageUpload');

const mainUploadImage = multer({ storage, fileFilter }).single('picture');
module.exports = mainUploadImage;
