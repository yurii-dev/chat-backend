const asyncHandler = require("express-async-handler"),
  User = require("../../models/User");

exports.edit_password = asyncHandler(async (req, res) => {
  const { password = null } = req.body.user;

  if (!password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  if (password.trim().length < 8) {
    return res
      .status(400)
      .json({ message: "Ensure this field has at least 8 characters" });
  }
  const me = await User.findById(req.user.id);
  if (!me) {
    return res.status(404).json({ message: "User not found" });
  }

  me.password = password;
  await me.save();
  res.status(201).send();
});
