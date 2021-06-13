const asyncHandler = require("express-async-handler"),
  User = require("../../models/User");

exports.edit_username = asyncHandler(async (req, res) => {
  const { username = null } = req.body.user;
  if (!username) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  if (username.length < 4) {
    return res.status(400).json({ message: "Ensure this field has at least 4 characters" });
  }
  const isExistUserbyUserame = await User.findOne({ username });
  if (isExistUserbyUserame) {
    return res.status(400).json({
      email: `The username:'${username}' is used by another user.`,
    });
  }
  const me = await User.findById(req.user.id);
  if (!me) {
    return res.status(404).json({ message: "User not found" });
  }
  me.username = username;
  await me.save();
  res.status(201).json({ user: me.sendingUserData() });
});
