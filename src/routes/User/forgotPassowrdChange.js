const asyncHandler = require("express-async-handler"),
  User = require("../../models/User");

exports.forgot_password_change = asyncHandler(async (req, res) => {
  const { token: hash = null } = req.query;
  const { password = null } = req.body;

  if (!hash) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  if (!password || password.trim().length < 8) {
    return res
      .status(400)
      .json({ message: "Ensure this field has at least 8 characters" });
  }
  const user = await User.findOne().and({
    reset_password_hash: hash,
    confirmed: true,
  });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  let date = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
  if (user.reset_password_date < date) {
    return res.status(400).json({ message: "Time is expired" });
  }
  user.password = password;
  user.reset_password_hash = null;
  user.reset_password_date = null;
  await user.save();
  res.status(201).send();
});
