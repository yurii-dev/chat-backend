const multer = require("multer"),
  DatauriParser = require("datauri/parser"),
  path = require("path");

const storage = multer.memoryStorage();
const multerUploads = multer({ storage });

const parser = new DatauriParser();

module.exports = { multerUploads, parser };
