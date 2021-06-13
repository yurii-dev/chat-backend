const asyncHandler = require("express-async-handler"),
  User = require("../../models/User"),
  Message = require("../../models/Message"),
  bcrypt = require("bcryptjs"),
  { deleteAccountEmail } = require("../../resourses/mailer"),
  { ghostAvatar } = require("../../images/ghostAvatarBase64");

exports.delete_me = asyncHandler(async (req, res) => {
  const { password = null, removeMessagess = false } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const me = await User.findById(req.user.id);
  if (!me) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, me.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (removeMessagess) {
    await Message.deleteMany({ user: me._id });
  }
  deleteAccountEmail(me.email);
  me.email = "";
  me.username = "Deleted Account";
  me.password = "";
  me.avatar = ghostAvatar;
  me.confirmed = false;

  await me.save();
  res.sendStatus(200);
});
