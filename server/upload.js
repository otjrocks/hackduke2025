const multer = require("multer");

// Setup storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');  // Specify where to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Set the file name
  }
});

// Create the multer instance with storage configuration
const upload = multer({ storage: storage });

// Export the upload middleware
module.exports = upload;
