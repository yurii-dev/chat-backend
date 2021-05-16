const express = require("express"),
  cloudinary = require("../resourses/cloudinary"),
  asyncHandler = require("express-async-handler"),
  { multerUploads, parser } = require("../middleware/multer");

const path = require("path");
const UploadFile = require("../models/UploadFile");
const router = express.Router();

router.post(
  "/",
  multerUploads.single("file"),
  asyncHandler(async (req, res) => {
    const bufferFile = req.file;
    const filename = bufferFile.originalname;

    if (!bufferFile) {
      return res.status(400).json("Please upload a file");
    }
    const result = parser.format(
      path.extname(req.file.originalname),
      req.file.buffer
    ).content;

    const resFromCloud = await cloudinary.uploader.upload(result, {
      resource_type: "auto",
    });

    const { bytes: size, format: ext, url } = resFromCloud;

    const uploadFile = new UploadFile({
      filename,
      size,
      ext,
      url,
      user: req.user.id,
    });
    await uploadFile.save();
    res.status(200).json(uploadFile);
  })
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const fileId = req.body.fileId;
    if (!fileId) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const uploadedFile = await UploadFile.findById(fileId);
    if (!uploadedFile) {
      return res.status(404).json({ message: "Not found" });
    }
    await cloudinary.uploader.destroy(uploadedFile.filename);
    await uploadedFile.remove();
    res.sendStatus(200);
  })
);

// //development get all files
// router.get("/", async (req, res) => {
//   const files = await UploadFile.find();
//   res.status(200).json(files);
// });

module.exports = router;
