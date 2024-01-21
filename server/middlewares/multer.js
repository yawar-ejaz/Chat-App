const multer = require("multer");

const storage = multer.memoryStorage(); // Using memory storage for this example
const upload = multer({ storage }).single("file");

module.exports = upload;