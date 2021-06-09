const asyncHandler = require("express-async-handler"),
  { resetPasswordEmail } = require("../../resourses/mailer"),
  User = require("../../models/User"),
  validator = require("email-validator");

exports.forgot_password_hash = asyncHandler(async (req, res) => {
  const { email = null } = req.query;
  if (!validator.validate(email)) {
    return res.status(400).json({ email: "Incorrect e-mail" });
  }
  const user = await User.findOne().and({ email, confirmed: true });
  if (!user) {
    return res.status(200).json({ message: "success" });
  }
  user.reset_password_hash = await user.generateHash();
  user.reset_password_date = new Date();
  resetPasswordEmail(user.email, user.reset_password_hash);
  await user.save();
  return res.status(200).json({ message: "success" });
});
