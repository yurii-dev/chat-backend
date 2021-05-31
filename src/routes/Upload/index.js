const express = require("express"),
  { multerUploads, parser } = require("../../middleware/multer"),
  { upload_file } = require("./uploadFile"),
  { delete_file } = require("./deleteFile");

const router = express.Router();

router.post("/", multerUploads.single("file"), upload_file);

router.delete("/", delete_file);

module.exports = router;
