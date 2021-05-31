const cloudinary = require("../../resourses/cloudinary"),
  asyncHandler = require("express-async-handler"),
  { multerUploads, parser } = require("../../middleware/multer"),
  path = require("path"),
  UploadFile = require("../../models/UploadFile");

exports.upload_file = asyncHandler(async (req, res) => {
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
});
