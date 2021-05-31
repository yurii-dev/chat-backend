const asyncHandler = require("express-async-handler"),
  User = require("../../models/User"),
  sharp = require("sharp");

exports.upload_avatar = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).send("File is not selected");
  }
  const buffer = await sharp(req.file.buffer)
    .resize({
      width: 40,
      height: 40,
    })
    .toBuffer();

  if (!buffer) {
    return res.status(400).send("Please upload an image");
  }
  const me = await User.findById(req.user.id);
  if (!me) {
    return res.status(404).json({ message: "User not found" });
  }
  avatar = `data:image/png;base64,${buffer.toString("base64")}`;
  me.avatar = avatar;
  await me.save();
  res.status(201).json({ user: me.sendingUserData() });
});
