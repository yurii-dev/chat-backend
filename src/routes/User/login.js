const asyncHandler = require("express-async-handler"),
  User = require("../../models/User");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body.user;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const user = await User.findByCredentials(email, password);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  if (user.confirmed === false) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  res.status(200).json({ user: user.toAuthJSON() });
});
