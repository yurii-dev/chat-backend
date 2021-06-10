const asyncHandler = require("express-async-handler"),
  User = require("../../models/User");

exports.upload_avatar = asyncHandler(async (req, res) => {
  const { avatar = null } = req.body;
  if (!avatar || !typeof avatar === "string") {
    return res.status(400).json({ message: "Invalid data" });
  }
  const me = await User.findById(req.user.id);
  if (!me) {
    return res.sendStatus(404);
  }
  me.avatar = avatar;
  await me.save();
  res.status(201).json({ user: me.sendingUserData() });
});
