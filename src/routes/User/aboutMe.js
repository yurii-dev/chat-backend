const asyncHandler = require("express-async-handler"),
  User = require("../../models/User");

exports.about_me = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user.id);
  if (!me) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user: me.sendingUserData() });
});
