const cloudinary = require("../../resourses/cloudinary"),
  asyncHandler = require("express-async-handler"),
  UploadFile = require("../../models/UploadFile");

exports.delete_file = asyncHandler(async (req, res) => {
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
});
